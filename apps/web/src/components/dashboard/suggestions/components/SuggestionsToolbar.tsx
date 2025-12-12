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

interface SuggestionsToolbarProps {
  statusFilter: string;
  onFilterChange: (value: string) => void;
}

export function SuggestionsToolbar({
  statusFilter,
  onFilterChange,
}: SuggestionsToolbarProps) {
  const t = pt.dashboard.suggestions.status;

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
            <SelectItem value="pending">
              {pt.common.statusLabels.pending}
            </SelectItem>
            <SelectItem value="accepted">
              {pt.common.statusLabels.accepted}
            </SelectItem>
            <SelectItem value="rejected">
              {pt.common.statusLabels.rejected}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
