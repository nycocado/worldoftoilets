'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Loader2,
  MessageSquare,
  User,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import {
  getCommentReportDetails,
  acceptCommentReport,
  rejectCommentReport,
  setCommentReportPending,
} from '@/lib/api/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { pt as dateFnsPt } from 'date-fns/locale';
import { pt } from '@/locales/pt';

interface ReportCommentDetailDialogProps {
  aggregatedReport: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete: () => void;
}

export function ReportCommentDetailDialog({
  aggregatedReport,
  open,
  onOpenChange,
  onActionComplete,
}: ReportCommentDetailDialogProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const t = pt.dashboard.reports.comments.detail;
  const tToasts = pt.dashboard.reports.comments.toasts;
  const tStatus = pt.common.statusLabels;

  useEffect(() => {
    if (open && aggregatedReport) {
      fetchDetails();
    }
  }, [open, aggregatedReport]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await getCommentReportDetails(
        aggregatedReport.comment.publicId,
      );
      setDetails(response.data);
    } catch (error) {
      toast.error(tToasts.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (reportId: string) => {
    setProcessingId(reportId);
    try {
      await acceptCommentReport(reportId);
      toast.success(tToasts.acceptSuccess);
      onActionComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error(tToasts.acceptError);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reportId: string) => {
    setProcessingId(reportId);
    try {
      await rejectCommentReport(reportId);
      toast.success(tToasts.rejectSuccess);
      fetchDetails();
    } catch (error) {
      toast.error(tToasts.rejectError);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestore = async (reportId: string) => {
    setProcessingId(reportId);
    try {
      await setCommentReportPending(reportId);
      toast.success(tToasts.restoreSuccess);
      fetchDetails();
    } catch (error) {
      toast.error(tToasts.restoreError);
    } finally {
      setProcessingId(null);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-6 py-4 bg-muted/30 border-b shrink-0">
              <div className="flex items-start gap-3 p-3 bg-background rounded-lg border shadow-sm">
                <div className="mt-1">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {details.comment.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      •{' '}
                      {formatDistanceToNow(
                        new Date(details.comment.createdAt),
                        { addSuffix: true, locale: dateFnsPt },
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    {details.comment.text}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground px-1">
                <span>
                  {t.totalReports}:{' '}
                  <strong className="text-primary">
                    {details.totalReports}
                  </strong>
                </span>
                <span>Local: {details.comment.toilet?.name}</span>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t.history}
              </h4>
              <div className="space-y-3">
                {details.reports.map((report: any) => (
                  <div
                    key={report.publicId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            report.status === 'pending'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {report.typeReportComment.name}
                        </Badge>
                        {report.status !== 'pending' && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase"
                          >
                            {report.status === 'accepted'
                              ? tStatus.accepted
                              : tStatus.rejected}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{report.user?.name}</span>
                        <Clock className="h-3 w-3 ml-1" />
                        <span>
                          {formatDistanceToNow(new Date(report.createdAt), {
                            addSuffix: true,
                            locale: dateFnsPt,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleAccept(report.publicId)}
                            disabled={!!processingId}
                          >
                            {processingId === report.publicId ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              t.actions.accept
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                            onClick={() => handleReject(report.publicId)}
                            disabled={!!processingId}
                          >
                            {processingId === report.publicId ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              t.actions.reject
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2 hover:bg-muted"
                          onClick={() => handleRestore(report.publicId)}
                          disabled={!!processingId}
                          title={t.actions.restore}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          {t.actions.restore}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : null}

        <DialogFooter className="p-4 border-t bg-muted/10">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {pt.common.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
