'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';

import { getUsers, deleteUser, undeleteUser } from '@/lib/api/admin';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import type { UserAdminResponseDto } from '@/types/user';
import { EditRolesDialog } from './EditRolesDialog';
import { UsersToolbar } from '@/components/dashboard/users/components/UsersToolbar';
import { UsersTable } from '@/components/dashboard/users/components/UsersTable';
import { UserBanDialog } from '@/components/dashboard/users/components/UserBanDialog';
import { UserRestoreDialog } from '@/components/dashboard/users/components/UserRestoreDialog';
import { getColumns } from '@/components/dashboard/users/components/UsersTableColumns';
import { pt } from '@/locales/pt';

export default function UsersPage() {
  const t = pt.dashboard.users;
  const tToast = pt.dashboard.users.toasts;

  const [data, setData] = useState<UserAdminResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [userToEdit, setUserToEdit] = useState<UserAdminResponseDto | null>(
    null,
  );
  const [isEditRolesOpen, setIsEditRolesOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<UserAdminResponseDto | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [userToRestore, setUserToRestore] =
    useState<UserAdminResponseDto | null>(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        search: debouncedSearch,
        includeDeactivated: true,
      });

      const users = Array.isArray(response.data) ? response.data : [];
      setData(users);
      setHasNextPage(users.length === pagination.pageSize);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error(tToast.loadError);
      setData([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, tToast]);

  const handleBanUser = useCallback(async () => {
    if (!userToBan) return;
    try {
      await deleteUser(userToBan.publicId);
      toast.success(tToast.banSuccess, {
        description: `A conta de ${userToBan.name} foi desativada.`,
      });
      fetchData();
    } catch (error) {
      console.error('Failed to ban user', error);
      toast.error(tToast.banError);
    } finally {
      setIsBanDialogOpen(false);
      setUserToBan(null);
    }
  }, [userToBan, fetchData, tToast]);

  const handleRestoreUser = useCallback(async () => {
    if (!userToRestore) return;
    try {
      await undeleteUser(userToRestore.publicId);
      toast.success(tToast.restoreSuccess, {
        description: `A conta de ${userToRestore.name} foi reativada.`,
      });
      fetchData();
    } catch (error) {
      console.error('Failed to restore user', error);
      toast.error(tToast.restoreError);
    } finally {
      setIsRestoreDialogOpen(false);
      setUserToRestore(null);
    }
  }, [userToRestore, fetchData, tToast]);

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, fetchData]);

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (user) => {
          setUserToEdit(user);
          setIsEditRolesOpen(true);
        },
        onBan: (user) => {
          setUserToBan(user);
          setIsBanDialogOpen(true);
        },
        onRestore: (user) => {
          setUserToRestore(user);
          setIsRestoreDialogOpen(true);
        },
      }),
    [],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </div>

      <UsersToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        table={table}
      />

      <UsersTable
        table={table}
        loading={loading}
        columnsLength={columns.length}
        hasNextPage={hasNextPage}
      />

      <EditRolesDialog
        user={userToEdit}
        open={isEditRolesOpen}
        onOpenChange={setIsEditRolesOpen}
        onSuccess={() => {
          fetchData();
          setUserToEdit(null);
        }}
      />

      <UserBanDialog
        user={userToBan}
        open={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
        onConfirm={handleBanUser}
      />

      <UserRestoreDialog
        user={userToRestore}
        open={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
        onConfirm={handleRestoreUser}
      />
    </div>
  );
}
