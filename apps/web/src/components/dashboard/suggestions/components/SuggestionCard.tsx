'use client';

import {
  MapPin,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { pt as dateFnsPt } from 'date-fns/locale';
import { SuggestionMiniMap } from './SuggestionMiniMap';
import { pt } from '@/locales/pt';

interface SuggestionCardProps {
  item: any;
  statusFilter: string;
  isDark: boolean;
  processingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRestore: (id: string) => void;
  onView: (item: any) => void;
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function SuggestionCard({
  item,
  statusFilter,
  isDark,
  processingId,
  onApprove,
  onReject,
  onRestore,
  onView,
}: SuggestionCardProps) {
  const t = pt.dashboard.suggestions.card;
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
    <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 flex items-center gap-4">
            <div className="h-24 w-24 rounded-lg overflow-hidden border bg-muted shrink-0 relative">
              <SuggestionMiniMap
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
                <span className="truncate">{item.toilet?.address}</span>
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                {t.distance}:{' '}
                {distance < 1
                  ? `${(distance * 1000).toFixed(0)}m`
                  : `${distance.toFixed(2)}km`}
              </Badge>
            </div>
          </div>

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
                  locale: dateFnsPt,
                })}
              </span>
            </div>

            {item.photoUrl && (
              <Badge
                variant="secondary"
                className="w-fit mt-1 text-[10px] gap-1"
              >
                {t.newPhoto}
              </Badge>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-2 w-full">
            {statusFilter === 'pending' && (
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-9"
                  onClick={() => onApprove(item.publicId)}
                  disabled={processingId === item.publicId}
                >
                  {processingId === item.publicId ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> {t.approve}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-9 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                  onClick={() => onReject(item.publicId)}
                  disabled={processingId === item.publicId}
                >
                  <XCircle className="mr-2 h-3.5 w-3.5" /> {t.reject}
                </Button>
              </div>
            )}
            {statusFilter !== 'pending' && (
              <Button
                size="sm"
                variant="outline"
                className="w-full h-8"
                onClick={() => onRestore(item.publicId)}
                disabled={processingId === item.publicId}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                {t.restore}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-muted/60 transition-colors group"
        onClick={() => onView(item)}
      >
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
          <span className="uppercase font-bold opacity-50">
            {t.suggestionId}:
          </span>
          {item.publicId}
        </div>
        <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline decoration-primary/50 underline-offset-4">
          {t.viewDetails}
          <Eye className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Card>
  );
}
