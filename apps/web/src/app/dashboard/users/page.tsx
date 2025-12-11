'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Search,
  UserCog,
  Loader2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldAlert, // For ban action
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { getUsers, deleteUser, undeleteUser } from '@/lib/api/admin';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import type { UserAdminResponseDto } from '@/types/user';
import { UserRolesCell } from './UserRolesCell';
import { EditRolesDialog } from './EditRolesDialog';

export default function UsersPage() {
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

  // --- Dialog/Modal States ---
  const [userToEdit, setUserToEdit] = useState<UserAdminResponseDto | null>(
    null,
  );
  const [isEditRolesOpen, setIsEditRolesOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<UserAdminResponseDto | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [userToRestore, setUserToRestore] =
    useState<UserAdminResponseDto | null>(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  // --- API Calls & Handlers ---

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
      setData([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  const handleBanUser = useCallback(async () => {
    if (!userToBan) return;
    try {
      await deleteUser(userToBan.publicId);
      toast.success('Utilizador banido', {
        description: `A conta de ${userToBan.name} foi desativada.`,
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to ban user', error);
      toast.error('Erro ao banir', {
        description: 'Não foi possível desativar o utilizador.',
      });
    } finally {
      setIsBanDialogOpen(false);
      setUserToBan(null);
    }
  }, [userToBan, fetchData, setIsBanDialogOpen, setUserToBan]);

  const handleRestoreUser = useCallback(async () => {
    if (!userToRestore) return;
    try {
      await undeleteUser(userToRestore.publicId);
      toast.success('Utilizador restaurado', {
        description: `A conta de ${userToRestore.name} foi reativada.`,
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to restore user', error);
      toast.error('Erro ao restaurar', {
        description: 'Não foi possível reativar o utilizador.',
      });
    } finally {
      setIsRestoreDialogOpen(false);
      setUserToRestore(null);
    }
  }, [userToRestore, fetchData, setIsRestoreDialogOpen, setUserToRestore]);

  // --- Effects ---
  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, fetchData]);

  // --- Table Columns ---
  const columns: ColumnDef<UserAdminResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Utilizador',
      cell: ({ row }) => {
        const user = row.original;
        const initials =
          user.name
            ?.split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U';

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={
                  user.icon ? `/${user.icon.replace('-', '')}.png` : undefined
                }
                alt={user.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'roles',
      header: 'Cargos & Permissões',
      cell: ({ row }) => <UserRolesCell roles={row.getValue('roles')} />,
    },
    {
      accessorKey: 'deactivatedAt',
      header: 'Status',
      cell: ({ row }) => {
        const deactivatedAt = row.getValue('deactivatedAt');
        const isActive = !deactivatedAt;
        return (
          <Badge
            variant={isActive ? 'outline' : 'destructive'}
            className={isActive ? 'gap-1 pr-2 bg-green-100 text-green-700 border-green-200' : 'gap-1 pr-2'}
          >
            {isActive ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Ativo
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" /> Desativado
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'points',
      header: 'Pontos',
      cell: ({ row }) => (
        <div className="font-medium pl-2">{row.getValue('points')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Registado em',
      cell: ({ row }) => {
        return (
          <span className="text-xs text-muted-foreground">
            {new Date(row.getValue('createdAt')).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const isBanned = !!user.deactivatedAt;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.publicId)}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setUserToEdit(user);
                  setIsEditRolesOpen(true);
                }}
              >
                <UserCog className="mr-2 h-4 w-4" /> Editar Cargos
              </DropdownMenuItem>

              {isBanned ? (
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-600 focus:bg-green-50"
                  onClick={() => {
                    setUserToRestore(user);
                    setIsRestoreDialogOpen(true);
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Restaurar Utilizador
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => {
                    setUserToBan(user);
                    setIsBanDialogOpen(true);
                  }}
                >
                  <ShieldAlert className="mr-2 h-4 w-4" /> Banir Utilizador
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
          <h2 className="text-2xl font-bold tracking-tight">
            Gestão de Utilizadores
          </h2>
          <p className="text-muted-foreground">
            Gerencie contas, permissões e veja estatísticas de uso.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Add New User Button or Export could go here */}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span>Carregando utilizadores...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum utilizador encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Linhas por página</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {pagination.pageIndex + 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!hasNextPage}
          >
            Próxima
          </Button>
        </div>
      </div>

      <EditRolesDialog
        user={userToEdit}
        open={isEditRolesOpen}
        onOpenChange={setIsEditRolesOpen}
        onSuccess={() => {
          fetchData();
          setUserToEdit(null);
        }}
      />

      <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá desativar a conta do utilizador{' '}
              <b>{userToBan?.name}</b>.
              <br />O utilizador perderá o acesso imediatamente. Esta ação pode
              ser revertida posteriormente por um administrador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sim, banir utilizador
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Restauração</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá restaurar a conta do utilizador{' '}
              <b>{userToRestore?.name}</b>.
              <br />O utilizador terá acesso novamente a todas as
              funcionalidades.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreUser}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Sim, restaurar utilizador
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
