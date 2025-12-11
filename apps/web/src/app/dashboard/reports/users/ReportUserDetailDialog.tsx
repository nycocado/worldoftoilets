'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Loader2,
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  getUserReportDetails,
  acceptUserReport,
  rejectUserReport,
  setUserReportsPending,
} from '@/lib/api/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReportUserDetailDialogProps {
  userReportedId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete: () => void;
}

export function ReportUserDetailDialog({
  userReportedId,
  open,
  onOpenChange,
  onActionComplete,
}: ReportUserDetailDialogProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (open && userReportedId) {
      fetchDetails();
    }
  }, [open, userReportedId]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await getUserReportDetails(userReportedId);
      setDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch report details', error);
      toast.error('Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    reportId: string,
    action: 'accept' | 'reject' | 'restore',
  ) => {
    setProcessing(true);
    try {
      if (action === 'accept') {
        await acceptUserReport(reportId);
        toast.success('Denúncia aceite. Usuário banido.');
      } else if (action === 'reject') {
        await rejectUserReport(reportId);
        toast.success('Denúncia rejeitada.');
      } else if (action === 'restore') {
        await setUserReportsPending(reportId);
        toast.success('Denúncia restaurada para pendente.');
      }
      fetchDetails();
      onActionComplete();
      onOpenChange(false); // Close dialog after action
    } catch (error) {
      console.error(`Failed to ${action} report`, error);
      toast.error(`Erro ao processar ação.`);
    } finally {
      setProcessing(false);
    }
  };

  const REPORT_TYPES: Record<string, string> = {
    'harassment-abuse': 'Assédio/Abuso',
    'fake-account': 'Conta Falsa',
    impersonation: 'Impersonação',
    'hate-speech': 'Discurso de Ódio',
    'privacy-violation': 'Violação de Privacidade',
    spam: 'Spam',
    others: 'Outros',
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes da Denúncia</DialogTitle>
          <DialogDescription>
            Analise as infrações reportadas para decidir a ação apropriada.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="flex flex-col gap-6 overflow-hidden flex-1">
            {/* Header Info */}
            <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg border">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={
                    details.userReported.icon
                      ? `/${details.userReported.icon.replace('-', '')}.png`
                      : undefined
                  }
                />
                <AvatarFallback>
                  {details.userReported.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">
                      {details.userReported.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {details.userReported.email}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="h-7 bg-background border-dashed text-xs whitespace-nowrap"
                  >
                    {details.totalReports} Denúncias Totais
                  </Badge>
                </div>

                {/* Stats Summary Inline */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {Object.entries(details.reportsByType || {}).map(
                    ([type, count]: [string, any]) => (
                      <Badge
                        key={type}
                        variant="destructive"
                        className="h-7 whitespace-nowrap shadow-sm"
                      >
                        {REPORT_TYPES[type] || type}: {count}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <h4 className="font-semibold mb-3 flex items-center gap-2 shrink-0">
                <Clock className="h-4 w-4 text-primary" />
                Histórico de Ocorrências
              </h4>
              <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-3 pb-4">
                  {details.reports?.map((report: any) => (
                    <div
                      key={report.publicId}
                      className="p-4 border rounded-lg bg-card hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {REPORT_TYPES[report.typeReportUser.apiName]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            por{' '}
                            <span className="font-medium text-foreground">
                              {report.userReporter.name}
                            </span>
                          </span>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              report.status === 'pending'
                                ? 'destructive'
                                : 'outline'
                            }
                            className="text-[10px] uppercase mb-1"
                          >
                            {report.status}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(report.createdAt), {
                              addSuffix: true,
                              locale: pt,
                            })}
                          </div>
                        </div>
                      </div>

                      {report.status === 'pending' && (
                        <div className="flex gap-2 justify-end mt-3 pt-3 border-t border-dashed">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white"
                            onClick={() =>
                              handleAction(report.publicId, 'accept')
                            }
                            disabled={processing}
                          >
                            Banir por este motivo
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                            onClick={() =>
                              handleAction(report.publicId, 'reject')
                            }
                            disabled={processing}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      )}

                      {report.status !== 'pending' && (
                        <div className="pt-2 mt-2 border-t flex justify-between items-center">
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Resolvido por{' '}
                            {report.reviewedBy?.name}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-[10px] px-2 hover:bg-muted"
                            onClick={() =>
                              handleAction(report.publicId, 'restore')
                            }
                            disabled={processing}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restaurar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Erro ao carregar dados.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
