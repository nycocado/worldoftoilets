'use client';

import { Eye, ShieldAlert, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { pt as dateFnsPt } from 'date-fns/locale';
import { pt } from '@/locales/pt';
import { getUserAvatarUrl } from '@/lib/utils';

interface UserReportCardProps {
  item: any;
  statusFilter: string;
  onView: (item: any) => void;
}

export function UserReportCard({ item, onView }: UserReportCardProps) {
  const t = pt.common.reportCard;
  const tSpecific = pt.dashboard.reports.users.card;
  const tTypes = pt.dashboard.reports.users.types;
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

  const getReportTypeLabel = (type: string) => {
    return (tTypes as any)[type] || type;
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 1. User Profile (Left) */}
          <div className="lg:col-span-4 flex items-center gap-4 w-full lg:w-auto min-w-[250px]">
            <Avatar className="h-14 w-14 border">
              <AvatarImage src={getUserAvatarUrl(item.userReported.icon)} />
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
                {getStatusLabel(item.status)}
              </Badge>
            </div>
          </div>

          {/* 2. Report Stats (Center) */}
          <div className="lg:col-span-6 w-full grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                {t.totalReports}
              </span>
              <span className="text-xl font-bold text-foreground">
                {item.totalReports}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-l border-r border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                {t.mainReason}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                {getReportTypeLabel(item.mostFrequentType)}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                {t.lastReport}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                {formatDistanceToNow(new Date(item.latestReportDate), {
                  addSuffix: true,
                  locale: dateFnsPt,
                })}
              </div>
            </div>
          </div>

          {/* 3. Actions (Right) */}
          <div className="lg:col-span-2 flex flex-row gap-3 w-full justify-end">
            <Button size="sm" className="w-full" onClick={() => onView(item)}>
              <Eye className="mr-2 h-3.5 w-3.5" /> {t.action}
            </Button>
          </div>
        </div>
      </div>

      {/* "Shadow" / Footer Bar */}
      <div
        className="bg-muted/40 border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-muted/60 transition-colors group"
        onClick={() => onView(item)}
      >
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
          <span className="uppercase font-bold opacity-50">
            {tSpecific.id}:
          </span>
          {item.userReported.publicId}
        </div>
        <div className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline decoration-primary/50 underline-offset-4">
          {t.viewDetails}
          <Eye className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Card>
  );
}
