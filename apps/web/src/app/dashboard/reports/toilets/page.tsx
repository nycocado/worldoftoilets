'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Gavel,
  Ban,
  RotateCcw,
  MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getToiletReports } from '@/lib/api/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ReportToiletDetailDialog } from './ReportToiletDetailDialog';

interface ReportToiletListDto {
  toilet: {
    publicId: string;
    name: string;
    address: string;
    photoUrl?: string;
    access?: { name: string; apiName: string }; // Added access
    extras?: Array<{ name: string; apiName: string } | string>; // Added extras
  };
  totalReports: number;
  mostFrequentType: string;
  latestReportDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function ToiletReportsPage() {
  const [data, setData] = useState<ReportToiletListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });
  const [statusFilter, setStatusFilter] = useState('pending');

  const [selectedToilet, setSelectedToilet] =
    useState<ReportToiletListDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getToiletReports({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        status: statusFilter,
      });

      const result = Array.isArray(response.data) ? response.data : [];
      setData(result);
    } catch (error) {
      console.error('Failed to fetch toilet reports', error);
      toast.error('Erro ao carregar denúncias');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, statusFilter]);

  const REPORT_TYPES: Record<string, string> = {
    'fake-information': 'Informação Falsa',
    'unsanitary-conditions': 'Más Condições de Higiene',
    'privacy-violation': 'Violação de Privacidade',
    'maintenance-needed': 'Necessita Manutenção',
    'damaged-equipment': 'Equipamento Danificado',
    others: 'Outros',
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Denúncias de Casas de Banho
          </h2>
          <p className="text-muted-foreground">
            Gerencie problemas reportados em instalações.
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
              <SelectItem value="accepted">Aceites (Confirmados)</SelectItem>
              <SelectItem value="rejected">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando tickets...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">Tudo limpo!</h3>
          <p className="text-muted-foreground">
            Não há denúncias com este status.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.map((item) => (
            <Card
              key={item.toilet?.publicId || Math.random()}
              className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* 1. Toilet Info (Left) - Fixed 4 columns */}
                  <div className="lg:col-span-4 flex items-center gap-6">
                    <Avatar className="h-24 w-24 border rounded-lg shadow-sm shrink-0">
                      <AvatarImage
                        src={item.toilet?.photoUrl}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden space-y-1 min-w-0">
                      <h4
                        className="font-bold text-xl text-foreground truncate"
                        title={item.toilet?.name}
                      >
                        {item.toilet?.name}
                      </h4>
                      <p
                        className="text-sm text-muted-foreground truncate flex items-center gap-1.5"
                        title={item.toilet?.address}
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {item.toilet?.address || 'Sem endereço'}
                        </span>
                      </p>
                      <div className="pt-1 flex flex-wrap gap-2">
                        <Badge
                          variant={
                            item.status === 'pending'
                              ? 'destructive'
                              : item.status === 'accepted'
                                ? 'default'
                                : 'outline'
                          }
                        >
                          {item.status === 'pending'
                            ? 'Pendente'
                            : item.status === 'accepted'
                              ? 'Confirmado'
                              : 'Rejeitado'}
                        </Badge>
                        {item.toilet?.access?.name && (
                          <Badge variant="secondary" className="text-xs">
                            Acesso: {item.toilet.access.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Report Stats (Center) - Fixed 6 columns */}
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
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span
                          className="truncate min-w-0"
                          title={
                            REPORT_TYPES[item.mostFrequentType] ||
                            item.mostFrequentType
                          }
                        >
                          {REPORT_TYPES[item.mostFrequentType] ||
                            item.mostFrequentType}
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
                          {formatDistanceToNow(
                            new Date(item.latestReportDate),
                            { addSuffix: true, locale: pt },
                          ).replace('há aproximadamente', 'há')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Actions (Right) - Fixed 2 columns */}
                  <div className="lg:col-span-2 flex flex-row gap-3 w-full justify-end">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedToilet(item);
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
                  setSelectedToilet(item);
                  setIsDialogOpen(true);
                }}
              >
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                  <span className="uppercase font-bold opacity-50">ID:</span>
                  {item.toilet?.publicId}
                </div>
                <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline decoration-primary/50 underline-offset-4">
                  Visualizar Detalhes
                  <Eye className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Card>
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
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))
          }
          disabled={data.length < pagination.pageSize}
        >
          Próxima
        </Button>
      </div>

      {selectedToilet && (
        <ReportToiletDetailDialog
          toiletReportedId={selectedToilet.toilet.publicId}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onActionComplete={fetchData}
        />
      )}
    </div>
  );
}
