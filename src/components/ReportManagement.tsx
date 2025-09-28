import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchReports();
    const reportsSubscription = supabase
      .channel('report_management_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'flood_reports' 
      }, fetchReports)
      .subscribe();

    return () => {
      supabase.removeChannel(reportsSubscription);
    };
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flood_reports')
        .select('*');
      if (error) throw error;
      setReports(data);
    } catch (error) {
      toast.error('Failed to fetch reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const { error } = await supabase
        .from('flood_reports')
        .update({ status: newStatus })
        .eq('id', reportId);
      if (error) throw error;
      toast.success('Report status updated successfully');
    } catch (error) {
      toast.error('Failed to update report status');
      console.error(error);
    }
  };

  const deleteReport = async (reportId) => {
    try {
      const { error } = await supabase
        .from('flood_reports')
        .delete()
        .eq('id', reportId);
      if (error) throw error;
      toast.success('Report deleted successfully');
    } catch (error) {
      toast.error('Failed to delete report');
      console.error(error);
    }
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(filter.toLowerCase()) ||
    report.location.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Report Management</h2>
        <Input 
          placeholder="Filter reports..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported by</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : (
            filteredReports.map(report => (
              <TableRow key={report.id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.location.address}</TableCell>
                <TableCell>
                  <Badge variant={report.severity === 'critical' ? 'destructive' : report.severity === 'high' ? 'destructive' : report.severity === 'medium' ? 'warning' : 'secondary'}>
                    {report.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={report.status === 'verified' ? 'success' : report.status === 'pending' ? 'outline' : 'secondary'}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{report.user_name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateReportStatus(report.id, 'verified')}>
                        Verify
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateReportStatus(report.id, 'resolved')}>
                        Resolve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateReportStatus(report.id, 'false_alarm')}>
                        Mark False Alarm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteReport(report.id)} className="text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportManagement;