'use client';

import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { pt } from '@/locales/pt';

interface CommentReportsToolbarProps {
  statusFilter: string;
  onFilterChange: (value: string) => void;
}

export function CommentReportsToolbar({
  statusFilter,
  onFilterChange,
}: CommentReportsToolbarProps) {
  const t = pt.dashboard.reports.comments.status;
  const tCommon = pt.common.statusLabels;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{t.label}</span>
        <Select value={statusFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder={t.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">{tCommon.pending}</SelectItem>
            <SelectItem value="accepted">{tCommon.accepted}</SelectItem>
            <SelectItem value="rejected">{tCommon.rejected}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
