'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
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
  MapPin,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  getToiletReportDetails,
  acceptToiletReport,
  rejectToiletReport,
  setToiletReportsPending,
} from '@/lib/api/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReportToiletDetailDialogProps {
  toiletReportedId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete: () => void;
}

export function ReportToiletDetailDialog({
  toiletReportedId,
  open,
  onOpenChange,
  onActionComplete,
}: ReportToiletDetailDialogProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { theme, resolvedTheme } = useTheme();

  const REPORT_TYPES: Record<string, string> = {
    'fake-information': 'Informação Falsa',
    'unsanitary-conditions': 'Más Condições de Higiene',
    'privacy-violation': 'Violação de Privacidade',
    'maintenance-needed': 'Necessita Manutenção',
    'damaged-equipment': 'Equipamento Danificado',
    others: 'Outros',
  };

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getToiletReportDetails(toiletReportedId);
      setDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch report details', error);
      toast.error('Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  }, [toiletReportedId, setLoading, setDetails, getToiletReportDetails, toast]); // Dependencies for useCallback

  useEffect(() => {
    if (open && toiletReportedId) {
      fetchDetails();
    }
  }, [open, toiletReportedId, fetchDetails]); // Add fetchDetails as dependency

  // Map Initialization Effect
  useEffect(() => {
    // Only initialize map if dialog is open, not loading, details exist, map container is ready and coordinates are present
    if (!open || loading || !details || !mapContainer.current) return;
    if (!details.toilet?.latitude || !details.toilet?.longitude) {
      console.warn('Map: Missing toilet coordinates.', details.toilet); // Keep warning for missing coords
      return;
    }

    const isDark = theme === 'dark' || resolvedTheme === 'dark';
    const styleUrl = isDark
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [details.toilet.longitude, details.toilet.latitude],
        zoom: 15,
        interactive: true,
        attributionControl: false,
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add Marker
      new maplibregl.Marker({ color: '#e11d48' }) // Primary/Destructive color
        .setLngLat([details.toilet.longitude, details.toilet.latitude])
        .addTo(map.current);
    } else {
      // If map exists, only update style if needed (theme change)
      if ((map.current.getStyle().metadata as any)?.['maplibre:import'] !== styleUrl) {
        map.current.setStyle(styleUrl);
      }
      // Fly to coordinates if they change (unlikely in this context, but good practice)
      if (
        map.current.getCenter().lat !== details.toilet.latitude ||
        map.current.getCenter().lng !== details.toilet.longitude
      ) {
        map.current.flyTo({
          center: [details.toilet.longitude, details.toilet.latitude],
          zoom: 15,
        });
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null; // Clear the ref
      }
    };
  }, [open, loading, details, theme, resolvedTheme]);

  const handleAction = async (
    reportId: string,
    action: 'accept' | 'reject' | 'restore',
  ) => {
    setProcessing(true);
    try {
      if (action === 'accept') {
        await acceptToiletReport(reportId);
        toast.success('Denúncia confirmada.');
      } else if (action === 'reject') {
        await rejectToiletReport(reportId);
        toast.success('Denúncia rejeitada.');
      } else if (action === 'restore') {
        await setToiletReportsPending(reportId);
        toast.success('Denúncia restaurada para pendente.');
      }
      fetchDetails();
      onActionComplete();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${action} report`, error);
      toast.error(`Erro ao processar ação.`);
    } finally {
      setProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-0 shrink-0">
          <DialogTitle>Detalhes da Denúncia da Casa de Banho</DialogTitle>
          <DialogDescription>
            Análise detalhada da instalação reportada e histórico de infrações.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="flex flex-col md:flex-row h-full min-h-[600px] flex-1 pt-6">
            {/* Left Side: Toilet Info & Map */}
            <div className="md:w-1/2 flex flex-col border-r bg-muted/10 overflow-y-auto p-6 gap-6">
              {/* Image Card */}
              <div className="rounded-xl overflow-hidden border shadow-sm w-full h-64 relative bg-muted shrink-0 group">
                {details.toilet.photoUrl ? (
                  <img
                    src={details.toilet.photoUrl}
                    alt={details.toilet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <MapPin className="h-12 w-12 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                  <div className="text-white w-full">
                    <h3 className="font-bold text-2xl shadow-sm leading-tight mb-1">
                      {details.toilet.name}
                    </h3>
                    <p className="text-xs text-white/80 flex items-start gap-1.5 shadow-sm font-medium">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">
                        {details.toilet.address}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Stats & Badges */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Status & Detalhes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="h-7 bg-background border-dashed"
                    >
                      {details.totalReports} Denúncias Totais
                    </Badge>
                    {details.toilet.access?.name && (
                      <Badge variant="secondary" className="h-7">
                        Acesso: {details.toilet.access.name}
                      </Badge>
                    )}
                    {details.toilet.extras?.map((extra: any) => (
                      <Badge
                        key={extra.apiName || extra}
                        variant="outline"
                        className="h-7 bg-background"
                      >
                        {typeof extra === 'object' ? extra.name : extra}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(details.reportsByType || {}).map(
                      ([type, count]: [string, any]) => (
                        <Badge
                          key={type}
                          variant="destructive"
                          className="h-7 shadow-sm"
                        >
                          {REPORT_TYPES[type] || type}: {count}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                {/* Map Card */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    Localização
                  </h4>
                  <div className="rounded-xl overflow-hidden border shadow-sm h-48 w-full relative bg-muted hover:shadow-md transition-shadow">
                    <div
                      ref={mapContainer}
                      className="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute bottom-1 right-1 bg-background/80 backdrop-blur px-1.5 py-0.5 rounded text-[8px] text-muted-foreground pointer-events-none">
                      MapLibre
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Reports List */}
            <div className="md:w-1/2 flex flex-col bg-background h-full">
              <div className="p-6 border-b shrink-0">
                <div className="text-lg font-semibold mb-1">
                  Histórico de Denúncias
                </div>
                <div className="text-sm text-muted-foreground">
                  Gerencie as ocorrências reportadas.
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4 pb-4">
                  {details.reports?.map((report: any) => (
                    <div
                      key={report.publicId}
                      className="p-4 border rounded-lg bg-card hover:bg-muted/5 transition-colors shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm flex items-center gap-2">
                            {REPORT_TYPES[report.typeReportToilet?.apiName] ||
                              report.typeReportToilet?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Reportado por{' '}
                            <span className="font-medium text-foreground">
                              {report.user?.name}
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

                      {/* Evidence Image if available */}
                      {/* Assuming report might have evidence image? If not, skip. */}

                      {report.status === 'pending' && (
                        <div className="flex gap-2 justify-end mt-3 pt-3 border-t border-dashed">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
                            onClick={() =>
                              handleAction(report.publicId, 'accept')
                            }
                            disabled={processing}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
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
