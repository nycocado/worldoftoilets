'use client';

import { MapPin, ShieldAlert, Clock, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { pt as dateFnsPt } from 'date-fns/locale';
import { pt } from '@/locales/pt';

interface ToiletReportCardProps {
  item: any;
  statusFilter: string;
  onView: (item: any) => void;
}

const REPORT_TYPES: Record<string, string> = {
  'fake-information': 'Informação Falsa',
  'unsanitary-conditions': 'Más Condições de Higiene',
  'privacy-violation': 'Violação de Privacidade',
  'maintenance-needed': 'Necessita Manutenção',
  'damaged-equipment': 'Equipamento Danificado',
  others: 'Outros',
};

export function ToiletReportCard({
  item,
  statusFilter,
  onView,
}: ToiletReportCardProps) {
  const t = pt.common.reportCard;
  const tSpecific = pt.dashboard.reports.toilets.card;
  const tStatus = pt.common.statusLabels;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return tStatus.pending;
      case 'accepted':
        return tStatus.accepted;
      case 'rejected':
        return tStatus.rejected;
      default:
        return status;
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
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
                  {item.toilet?.address || tSpecific.noAddress}
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
                  {getStatusLabel(item.status)}
                </Badge>
                {item.toilet?.access?.name && (
                  <Badge variant="secondary" className="text-xs">
                    {tSpecific.access}: {item.toilet.access.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* 2. Report Stats (Center) - Fixed 6 columns */}
          <div className="lg:col-span-6 w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-2 lg:px-6 lg:border-l lg:border-r border-border/40">
            <div className="flex flex-col items-center justify-center text-center px-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                {t.totalReports}
              </span>
              <span className="text-xl font-bold text-foreground">
                {item.totalReports}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-1 md:border-l md:border-r border-border/40 lg:border-none">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                {t.mainReason}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground justify-center max-w-full">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span
                  className="truncate min-w-0"
                  title={
                    REPORT_TYPES[item.mostFrequentType] || item.mostFrequentType
                  }
                >
                  {REPORT_TYPES[item.mostFrequentType] || item.mostFrequentType}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                {t.lastReport}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground justify-center max-w-full">
                <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>
                  {formatDistanceToNow(new Date(item.latestReportDate), {
                    addSuffix: true,
                    locale: dateFnsPt,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Actions (Right) - Fixed 2 columns */}
          <div className="lg:col-span-2 flex flex-row gap-3 w-full justify-end">
            <Button size="sm" className="w-full" onClick={() => onView(item)}>
              <Eye className="mr-2 h-3.5 w-3.5" /> {t.action}
            </Button>
          </div>
        </div>
      </div>

      <div
        className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-muted/60 transition-colors group"
        onClick={() => onView(item)}
      >
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
          <span className="uppercase font-bold opacity-50">{t.id}:</span>
          {item.toilet?.publicId}
        </div>
        <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline decoration-primary/50 underline-offset-4">
          {t.viewDetails}
          <Eye className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Card>
  );
}
