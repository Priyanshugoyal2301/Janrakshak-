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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
    const usersSubscription = supabase
      .channel('user_management_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_profiles' 
      }, fetchUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, last_sign_in_at, created_at');
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Input 
          placeholder="Filter users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : (
            filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(() => {
                    const last = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : 0;
                    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
                    const isActive = last && (Date.now() - last) <= THIRTY_DAYS_MS;
                    return (
                      <Badge variant={isActive ? 'success' : 'secondary'}>
                        {isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                        Make {user.role === 'admin' ? 'User' : 'Admin'}
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

export default UserManagement;