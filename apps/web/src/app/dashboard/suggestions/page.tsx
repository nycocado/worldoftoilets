'use client';

import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  User,
  Clock,
  RotateCcw,
  Eye,
  Navigation,
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

import {
  getSuggestions,
  approveSuggestion,
  rejectSuggestion,
  setSuggestionPending,
} from '@/lib/api/admin';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { SuggestionDetailDialog } from './SuggestionDetailDialog';

// Helper to calculate distance
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function MiniMap({
  origin,
  destination,
  isDark,
}: {
  origin: [number, number];
  destination: [number, number];
  isDark: boolean;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check for valid coordinates before initializing
    if (
      origin[0] === 0 ||
      origin[1] === 0 ||
      destination[0] === 0 ||
      destination[1] === 0
    )
      return;

    const styleUrl = isDark
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: origin,
        zoom: 13,
        interactive: false, // Static view
        attributionControl: false,
      });

      // Fit bounds to show both points with padding
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      map.current.fitBounds(bounds, { padding: 30, maxZoom: 15 });

      // Add markers
      // Origin (Blue)
      new maplibregl.Marker({ color: '#3b82f6', scale: 0.6 })
        .setLngLat(origin)
        .addTo(map.current);

      // Destination (Red)
      new maplibregl.Marker({ color: '#ef4444', scale: 0.6 })
        .setLngLat(destination)
        .addTo(map.current);
    } else {
      // Update logic if needed when props change drastically, but for list items usually not needed
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isDark, origin, destination]);

  return <div ref={mapContainer} className="w-full h-full bg-muted" />;
}

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
      toast.error('Erro ao carregar sugestões');
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
      toast.success('Sugestão aprovada.');
      fetchData();
    } catch (error) {
      toast.error('Erro ao aprovar sugestão.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectSuggestion(id);
      toast.success('Sugestão rejeitada.');
      fetchData();
    } catch (error) {
      toast.error('Erro ao rejeitar sugestão.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestore = async (id: string) => {
    setProcessingId(id);
    try {
      await setSuggestionPending(id);
      toast.success('Sugestão restaurada para pendente.');
      fetchData();
    } catch (error) {
      toast.error('Erro ao restaurar sugestão.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Sugestões de Edição
          </h2>
          <p className="text-muted-foreground">
            Analise sugestões de local e dados enviadas pelos usuários.
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
              <SelectItem value="accepted">Aprovadas</SelectItem>
              <SelectItem value="rejected">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando sugestões...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">Tudo atualizado!</h3>
          <p className="text-muted-foreground">Não há sugestões pendentes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.map((item) => {
            const toiletLat = item.toilet?.latitude || 0;
            const toiletLon = item.toilet?.longitude || 0;
            const suggLat = item.latitude || 0;
            const suggLon = item.longitude || 0;
            const distance = getDistanceFromLatLonInKm(
              toiletLat,
              toiletLon,
              suggLat,
              suggLon,
            );

            return (
              <Card
                key={item.publicId}
                className="overflow-hidden border-l-4 border-l-primary shadow-sm"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* 1. Map Placeholder & Toilet Info (Left) - 4 Cols */}
                    <div className="lg:col-span-4 flex items-center gap-4">
                      <div className="h-24 w-24 rounded-lg overflow-hidden border bg-muted shrink-0 relative">
                        <MiniMap
                          origin={[toiletLon, toiletLat]}
                          destination={[suggLon, suggLat]}
                          isDark={isDark}
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h4
                          className="font-bold text-base truncate"
                          title={item.toilet?.name}
                        >
                          {item.toilet?.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {item.toilet?.address}
                          </span>
                        </div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Distância:{' '}
                          {distance < 1
                            ? `${(distance * 1000).toFixed(0)}m`
                            : `${distance.toFixed(2)}km`}
                        </Badge>
                      </div>
                    </div>

                    {/* 2. Suggestion Details (Center) - 6 Cols */}
                    <div className="lg:col-span-6 w-full px-4 border-l border-r border-border/40 flex flex-col justify-center gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{item.user?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                            locale: pt,
                          })}
                        </span>
                      </div>

                      {item.photoUrl && (
                        <Badge
                          variant="secondary"
                          className="w-fit mt-1 text-[10px] gap-1"
                        >
                          📸 Nova foto
                        </Badge>
                      )}
                    </div>

                    {/* 3. Actions (Right) - 2 Cols */}
                    <div className="lg:col-span-2 flex flex-col gap-2 w-full justify-center">
                      {statusFilter === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-8"
                            onClick={() => handleApprove(item.publicId)}
                            disabled={processingId === item.publicId}
                          >
                            {processingId === item.publicId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-3.5 w-3.5" />{' '}
                                Aprovar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                            onClick={() => handleReject(item.publicId)}
                            disabled={processingId === item.publicId}
                          >
                            <XCircle className="mr-2 h-3.5 w-3.5" /> Rejeitar
                          </Button>
                        </div>
                      )}
                      {statusFilter !== 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-8"
                          onClick={() => handleRestore(item.publicId)}
                          disabled={processingId === item.publicId}
                        >
                          <RotateCcw className="mr-2 h-3.5 w-3.5" />
                          Restaurar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div
                  className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-muted/60 transition-colors group"
                  onClick={() => {
                    setSelectedSuggestion(item);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <span className="uppercase font-bold opacity-50">
                      ID da Sugestão:
                    </span>
                    {item.publicId}
                  </div>
                  <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline decoration-primary/50 underline-offset-4">
                    Visualizar Detalhes
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

      {selectedSuggestion && (
        <SuggestionDetailDialog
          key={selectedSuggestion.publicId} // Force re-mount on change
          suggestion={selectedSuggestion}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onActionComplete={fetchData}
        />
      )}
    </div>
  );
}
