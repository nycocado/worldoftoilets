'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  getSuggestions,
  approveSuggestion,
  rejectSuggestion,
  setSuggestionPending,
} from '@/lib/api/admin';
import { toast } from 'sonner';
import { SuggestionDetailDialog } from './SuggestionDetailDialog';
import { SuggestionCard } from '@/components/dashboard/suggestions/components/SuggestionCard';
import { SuggestionsToolbar } from '@/components/dashboard/suggestions/components/SuggestionsToolbar';
import { pt } from '@/locales/pt';
import { DashboardCardSkeleton } from '@/components/skeletons/DashboardCardSkeleton';

export default function SuggestionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });

  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  const t = pt.dashboard.suggestions;
  const tCommon = pt.common;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSuggestions({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        status: statusFilter,
      });
      const result = Array.isArray(response.data) ? response.data : [];
      setData(result);
    } catch (error) {
      console.error('Failed to fetch suggestions', error);
      toast.error(t.toasts.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, statusFilter]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveSuggestion(id);
      toast.success(t.toasts.approveSuccess);
      fetchData();
    } catch (error) {
      toast.error(t.toasts.approveError);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectSuggestion(id);
      toast.success(t.toasts.rejectSuccess);
      fetchData();
    } catch (error) {
      toast.error(t.toasts.rejectError);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestore = async (id: string) => {
    setProcessingId(id);
    try {
      await setSuggestionPending(id);
      toast.success(t.toasts.restoreSuccess);
      fetchData();
    } catch (error) {
      toast.error(t.toasts.restoreError);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </div>

      <SuggestionsToolbar
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
          <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">{t.emptyTitle}</h3>
          <p className="text-muted-foreground">{t.emptyDescription}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.map((item) => (
            <SuggestionCard
              key={item.publicId}
              item={item}
              statusFilter={statusFilter}
              isDark={isDark}
              processingId={processingId}
              onApprove={handleApprove}
              onReject={handleReject}
              onRestore={handleRestore}
              onView={(item) => {
                setSelectedSuggestion(item);
                setIsDialogOpen(true);
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

      {selectedSuggestion && (
        <SuggestionDetailDialog
          key={selectedSuggestion.publicId}
          suggestion={selectedSuggestion}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onActionComplete={fetchData}
        />
      )}
    </div>
  );
}
