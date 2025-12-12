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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { getUserReports, deleteUser, acceptUserReports } from '@/lib/api/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ReportUserDetailDialog } from './ReportUserDetailDialog';

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
    pageSize: 9, // 9 cards fits nicely in 3x3
  });
  const [statusFilter, setStatusFilter] = useState('pending');

  const [selectedUser, setSelectedUser] = useState<ReportUserListDto | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    'harassment-abuse': 'Assédio/Abuso',
    'fake-account': 'Conta Falsa',
    impersonation: 'Impersonação',
    'hate-speech': 'Discurso de Ódio',
    'privacy-violation': 'Violação de Privacidade',
    spam: 'Spam',
    others: 'Outros',
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Moderação de Usuários
          </h2>
          <p className="text-muted-foreground">
            Gerencie denúncias e infrações de perfis.
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
              <SelectItem value="accepted">Resolvidas (Banidos)</SelectItem>
              <SelectItem value="rejected">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Carregando tickets de denúncia...
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">Tudo limpo!</h3>
          <p className="text-muted-foreground">
            Não há denúncias com este status no momento.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.map((item) => (
            <Card
              key={item.userReported.publicId}
              className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* 1. User Profile (Left) */}
                  <div className="lg:col-span-4 flex items-center gap-4 w-full lg:w-auto min-w-[250px]">
                    <Avatar className="h-14 w-14 border">
                      <AvatarImage
                        src={
                          item.userReported.icon
                            ? `/${item.userReported.icon.replace('-', '')}.png`
                            : undefined
                        }
                      />
                      <AvatarFallback className="text-lg">
                        {item.userReported.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <h4
                        className="font-bold text-lg text-foreground truncate"
                        title={item.userReported.name}
                      >
                        {item.userReported.name}
                      </h4>
                      <p
                        className="text-sm text-muted-foreground truncate"
                        title={item.userReported.email}
                      >
                        {item.userReported.email}
                      </p>
                      <Badge
                        variant={
                          item.status === 'pending'
                            ? 'destructive'
                            : item.status === 'accepted'
                              ? 'default'
                              : 'outline'
                        }
                        className="mt-2"
                      >
                        {item.status === 'pending'
                          ? 'Pendente'
                          : item.status === 'accepted'
                            ? 'Banido'
                            : 'Rejeitado'}
                      </Badge>
                    </div>
                  </div>

                  {/* 2. Report Stats (Center) */}
                  <div className="lg:col-span-6 w-full grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                        Denúncias
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {item.totalReports}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center border-l border-r border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                        Motivo Principal
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                        {REPORT_TYPES[item.mostFrequentType] ||
                          item.mostFrequentType}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                        Última
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        {formatDistanceToNow(new Date(item.latestReportDate), {
                          addSuffix: true,
                          locale: pt,
                        }).replace('há aproximadamente', 'há')}
                      </div>
                    </div>
                  </div>

                  {/* 3. Actions (Right) */}
                  <div className="lg:col-span-2 flex flex-row gap-3 w-full justify-end">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedUser(item);
                        setIsSheetOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" /> Analisar
                    </Button>
                  </div>
                </div>
              </div>

              {/* "Shadow" / Footer Bar */}
              <div
                className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-muted/60 transition-colors group"
                onClick={() => {
                  setSelectedUser(item);
                  setIsSheetOpen(true);
                }}
              >
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                  <span className="uppercase font-bold opacity-50">
                    ID do Usuário:
                  </span>
                  {item.userReported.publicId}
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
