import React from "react";
import NDMALayout from "@/components/NDMALayout";
import AdminReports from "./AdminReports";

// DMA Reports wrapper that uses NDMA Layout instead of Admin Layout
const DMAReports = () => {
  return (
    <NDMALayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">DMA Reports & Analytics</h1>
        </div>
        {/* This would ideally be a separate DMA-specific component, 
            but for now we'll reuse admin logic with DMA layout */}
        <div className="[&_*]:!bg-transparent [&>*:first-child]:!hidden">
          <AdminReports />
        </div>
      </div>
    </NDMALayout>
  );
};

export default DMAReports;