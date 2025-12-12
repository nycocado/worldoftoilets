'use client';

import { Eye, Clock, CornerDownRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { pt as dateFnsPt } from 'date-fns/locale';
import { pt } from '@/locales/pt';

interface ReplyReportCardProps {
  item: any;
  statusFilter: string;
  onView: (item: any) => void;
}

export function ReplyReportCard({ item, onView }: ReplyReportCardProps) {
  const t = pt.common.reportCard;
  const tSpecific = pt.dashboard.reports.replies.card;
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

  const reply = item.reply;

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 1. Reply Info (Left) - 4 Cols */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CornerDownRight className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-sm truncate">
                {reply.user?.name || tSpecific.anonymous}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3 italic pl-6 border-l-2 border-muted">
              "{reply.text}"
            </p>
          </div>

          {/* 2. Stats (Center) - 6 Cols */}
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
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span
                  className="truncate min-w-0"
                  title={item.mostFrequentType}
                >
                  {item.mostFrequentType}
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

          {/* 3. Actions (Right) - 2 Cols */}
          <div className="lg:col-span-2 flex flex-row gap-3 w-full justify-end">
            <Button size="sm" className="w-full" onClick={() => onView(item)}>
              <Eye className="mr-2 h-3.5 w-3.5" /> {t.action}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div
        className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-muted/60 transition-colors group"
        onClick={() => onView(item)}
      >
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
          <span className="uppercase font-bold opacity-50">
            {tSpecific.id}:
          </span>
          {reply.publicId}
        </div>
        <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline decoration-primary/50 underline-offset-4">
          {t.viewDetails}
          <Eye className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Card>
  );
}
