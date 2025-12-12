'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  AlertTriangle,
  Clock,
  Eye,
  CornerDownRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getReplyReports } from '@/lib/api/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ReportReplyDetailDialog } from './ReportReplyDetailDialog';

export default function ReplyReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });
  
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getReplyReports({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        status: statusFilter,
      });
      const result = Array.isArray(response.data) ? response.data : [];
      setData(result);
    } catch (error) {
      console.error("Failed to fetch reports", error);
      toast.error("Erro ao carregar denúncias");
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
          <h2 className="text-2xl font-bold tracking-tight">Denúncias de Respostas</h2>
          <p className="text-muted-foreground">
            Gerencie respostas sinalizadas pela comunidade.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="accepted">Aceites</SelectItem>
              <SelectItem value="rejected">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando denúncias...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">Tudo limpo!</h3>
          <p className="text-muted-foreground">Não há denúncias pendentes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.map((item) => {
            const reply = item.reply;
            
            return (
              <Card key={reply.publicId} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* 1. Reply Info (Left) - 4 Cols */}
                    <div className="lg:col-span-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                           <CornerDownRight className="h-5 w-5 text-muted-foreground" />
                           <span className="font-semibold text-sm truncate">{reply.user?.name || 'Anônimo'}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3 italic pl-6 border-l-2 border-muted">
                           "{reply.text}"
                        </p>
                    </div>

                    {/* 2. Stats (Center) - 6 Cols */}
                    <div className="lg:col-span-6 w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-2 lg:px-6 lg:border-l lg:border-r border-border/40">
                       <div className="flex flex-col items-center justify-center text-center px-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                             Denúncias
                          </span>
                          <span className="text-xl font-bold text-foreground">
                             {item.totalReports}
                          </span>
                       </div>

                       <div className="flex flex-col items-center justify-center text-center px-1 md:border-l md:border-r border-border/40 lg:border-none">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                             Motivo Principal
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground justify-center max-w-full">
                             <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                             <span className="truncate min-w-0" title={item.mostFrequentType}>
                                {item.mostFrequentType}
                             </span>
                          </div>
                       </div>

                       <div className="flex flex-col items-center justify-center text-center px-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                             Última
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground justify-center max-w-full">
                             <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                             <span>
                                {formatDistanceToNow(new Date(item.latestReportDate), { addSuffix: true, locale: pt }).replace('há aproximadamente', 'há')}
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* 3. Actions (Right) - 2 Cols */}
                    <div className="lg:col-span-2 flex flex-row gap-3 w-full justify-end">
                       <Button
                         size="sm"
                         className="w-full"
                         onClick={() => {
                           setSelectedReport(item);
                           setIsDialogOpen(true);
                         }}
                       >
                         <Eye className="mr-2 h-3.5 w-3.5" /> Analisar
                       </Button>
                    </div>

                  </div>
                </div>

                {/* Footer Bar */}
                <div 
                  className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-muted/60 transition-colors group"
                  onClick={() => {
                    setSelectedReport(item);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <span className="uppercase font-bold opacity-50">ID da Resposta:</span>
                    {reply.publicId}
                  </div>
                  <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline decoration-primary/50 underline-offset-4">
                    Ver todas as denúncias
                    <Eye className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPagination(p => ({ ...p, pageIndex: Math.max(0, p.pageIndex - 1) }))}
          disabled={pagination.pageIndex === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }))}
          disabled={data.length < pagination.pageSize}
        >
          Próxima
        </Button>
      </div>

      {selectedReport && (
        <ReportReplyDetailDialog
          aggregatedReport={selectedReport}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onActionComplete={fetchData}
        />
      )}
    </div>
  );
}
