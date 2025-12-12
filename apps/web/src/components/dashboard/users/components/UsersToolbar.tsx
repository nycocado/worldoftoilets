'use client';

import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pt } from '@/locales/pt';
import { Table } from '@tanstack/react-table';

interface UsersToolbarProps<TData> {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  table: Table<TData>;
}

export function UsersToolbar<TData>({
  searchTerm,
  onSearchChange,
  table,
}: UsersToolbarProps<TData>) {
  const t = pt.dashboard.users;
  const tTable = t.table;

  const columnLabels: Record<string, string> = {
    name: tTable.user,
    roles: tTable.roles,
    deactivatedAt: tTable.status,
    points: tTable.points,
    createdAt: tTable.registeredAt,
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {pt.common.columns} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnLabels[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
