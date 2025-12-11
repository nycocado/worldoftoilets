'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronDown,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { ADMIN_NAVIGATION } from './navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout, hasAnyRole } = useAuth();
  const { isSidebarCollapsed, toggleSidebar } = useDashboard();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Filter navigation based on roles
  const filteredNav = React.useMemo(() => {
    return ADMIN_NAVIGATION.map((section) => {
      if (!section.items) {
        if (section.roles && !hasAnyRole(section.roles)) return null;
        return section;
      }
      if (section.roles && !hasAnyRole(section.roles)) return null;
      return section;
    }).filter(Boolean) as typeof ADMIN_NAVIGATION;
  }, [hasAnyRole]);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const userRoleLabel = React.useMemo(() => {
    if (!user?.roles?.length) return 'Usuário';

    // Priority check
    if (user.roles.some((r) => r.apiName === 'admin')) return 'Administrador';
    if (user.roles.some((r) => r.apiName === 'partners-administrator'))
      return 'Gestor de Parceiros';
    if (user.roles.some((r) => r.apiName === 'users-administrator'))
      return 'Gestor de Usuários';
    if (user.roles.some((r) => r.apiName === 'toilets-administrator'))
      return 'Gestor de Casas de Banho';
    if (user.roles.some((r) => r.apiName === 'comments-administrator'))
      return 'Moderador';
    if (user.roles.some((r) => r.apiName === 'partner')) return 'Parceiro';

    return user.roles[0].name;
  }, [user]);

  const toggleSection = (title: string) => {
    if (isSidebarCollapsed) return;
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div
        className={cn(
          'h-16 flex items-center border-b shrink-0',
          isSidebarCollapsed && !mobile
            ? 'justify-center'
            : 'px-6 justify-between',
        )}
      >
        {isSidebarCollapsed && !mobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-muted-foreground"
          >
            <PanelLeftOpen size={20} />
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-2 overflow-hidden">
              <Image
                src="/logo.svg"
                alt="World of Toilets"
                width={32}
                height={32}
                className="shrink-0"
              />
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                World of Toilets
              </span>
            </div>

            {!mobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 text-muted-foreground ml-auto"
              >
                <PanelLeftClose size={18} />
              </Button>
            )}
          </>
        )}
      </div>

      {/* User Profile Summary */}
      <div
        className={cn(
          'transition-all',
          isSidebarCollapsed && !mobile ? 'p-2' : 'px-4 pb-2 pt-6',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 bg-muted/50 rounded-xl border transition-all',
            isSidebarCollapsed && !mobile
              ? 'justify-center p-2 aspect-square'
              : 'p-3 mb-4',
          )}
        >
          <Avatar
            className={cn(isSidebarCollapsed && !mobile ? 'h-8 w-8' : '')}
          >
            <AvatarImage
              src={
                user?.icon ? `/${user.icon.replace('-', '')}.png` : undefined
              }
              alt={user?.name}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          {(!isSidebarCollapsed || mobile) && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                {userRoleLabel}
              </p>
            </div>
          )}
        </div>
        {(!isSidebarCollapsed || mobile) && (
          <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 mt-2">
            Menu Principal
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        <TooltipProvider delayDuration={0}>
          {filteredNav.map((section, idx) => {
            // Single Item
            if (!section.items) {
              const Icon = section.icon;
              const isActive = pathname === section.url;

              const button = (
                <Link key={section.url} href={section.url!}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full mb-1 transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground',
                      isSidebarCollapsed && !mobile
                        ? 'justify-center px-2'
                        : 'justify-start',
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          'h-4 w-4',
                          (!isSidebarCollapsed || mobile) && 'mr-2',
                        )}
                      />
                    )}
                    {(!isSidebarCollapsed || mobile) && section.title}
                  </Button>
                </Link>
              );

              if (isSidebarCollapsed && !mobile) {
                return (
                  <Tooltip key={section.url}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right">
                      {section.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return button;
            }

            // Section Group
            const isExpanded = expandedSections[section.title] ?? true;
            return (
              <div key={idx} className="mb-4">
                {!isSidebarCollapsed || mobile ? (
                  <>
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors"
                    >
                      {section.title}
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="space-y-1 mt-2 ml-1 pl-2 border-l animate-in slide-in-from-top-1 duration-200">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.url;
                          return (
                            <Link key={item.url} href={item.url}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  'w-full justify-start h-9 mb-1',
                                  isActive
                                    ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground',
                                )}
                              >
                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                {item.title}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  // Collapsed State for Group - Just icons if possible or hide
                  // For simplicity, if collapsed, we might only show the Group Icon if it had one, but groups in this config don't have icons always.
                  // Actually the config has icons for single items but not groups? Let's check.
                  // Config has icons for groups too.
                  // We can show the Group Icon as a trigger for a popover, but that's complex.
                  // Simple solution: Show header icon with tooltip. Clicking it expands sidebar.
                  <div className="flex justify-center py-2">
                    {/* If the group has no icon, maybe skip or use generic. Navigation config seems to lack icons for Groups? 
                         Checking navigation.ts: Groups do NOT have icons. Only items inside.
                         So for collapsed state, we can display the icons of the items inside directly?
                         Or just keep it clean: Groups are hidden, only single items show? No, that loses access.
                         
                         Let's iterate through items and show their icons.
                     */}
                    <div className="space-y-1 w-full">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.url;
                        return (
                          <Tooltip key={item.url}>
                            <TooltipTrigger asChild>
                              <Link href={item.url}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    'w-full justify-center h-9 mb-1 px-2',
                                    isActive
                                      ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                                      : 'text-muted-foreground hover:text-foreground',
                                  )}
                                >
                                  {Icon && <Icon className="h-4 w-4" />}
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      <div
        className={cn(
          'border-t bg-muted/30 mt-auto transition-all',
          isSidebarCollapsed && !mobile ? 'p-2' : 'p-4',
        )}
      >
        <div
          className={cn(
            'flex items-center mb-4',
            isSidebarCollapsed && !mobile
              ? 'justify-center flex-col gap-4'
              : 'justify-between',
          )}
        >
          {(!isSidebarCollapsed || mobile) && (
            <span className="text-xs font-bold text-muted-foreground">
              Opções
            </span>
          )}
          <ThemeToggle />
        </div>

        {isSidebarCollapsed && !mobile ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex bg-card border-r flex-col fixed inset-y-0 z-20 transition-[width] duration-300 ease-in-out',
          isSidebarCollapsed ? 'w-20' : 'w-72',
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent mobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
