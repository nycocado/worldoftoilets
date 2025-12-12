'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getUserReports } from '@/lib/api/admin';
import { toast } from 'sonner';
import { ReportUserDetailDialog } from './ReportUserDetailDialog';
import { UserReportCard } from '@/components/dashboard/reports/users/components/UserReportCard';
import { UserReportsToolbar } from '@/components/dashboard/reports/users/components/UserReportsToolbar';
import { pt } from '@/locales/pt';
import { DashboardCardSkeleton } from '@/components/skeletons/DashboardCardSkeleton';

interface ReportUserListDto {
  userReported: {
    publicId: string;
    name: string;
    icon: string;
    email: string;
  };
  totalReports: number;
  mostFrequentType: string;
  latestReportDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function UserReportsPage() {
  const [data, setData] = useState<ReportUserListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });
  const [statusFilter, setStatusFilter] = useState('pending');

  const [selectedUser, setSelectedUser] = useState<ReportUserListDto | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const t = pt.dashboard.reports.users;
  const tCommon = pt.common;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getUserReports({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        status: statusFilter,
      });

      const result = Array.isArray(response.data) ? response.data : [];
      setData(result);
    } catch (error) {
      console.error('Failed to fetch user reports', error);
      toast.error(t.toasts.loadError);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, statusFilter]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </div>

      <UserReportsToolbar
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {loading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">{t.emptyTitle}</h3>
          <p className="text-muted-foreground">{t.emptyDescription}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.map((item) => (
            <UserReportCard
              key={item.userReported.publicId}
              item={item}
              statusFilter={statusFilter}
              onView={(item) => {
                setSelectedUser(item);
                setIsSheetOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPagination((p) => ({
              ...p,
              pageIndex: Math.max(0, p.pageIndex - 1),
            }))
          }
          disabled={pagination.pageIndex === 0}
        >
          {tCommon.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))
          }
          disabled={data.length < pagination.pageSize}
        >
          {tCommon.next}
        </Button>
      </div>

      {selectedUser && (
        <ReportUserDetailDialog
          userReportedId={selectedUser.userReported.publicId}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onActionComplete={fetchData}
        />
      )}
    </div>
  );
}
