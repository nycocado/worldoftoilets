'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import { ADMIN_ROLES, PARTNER_ROLE, hasPermission } from '@/lib/constants';
import { setAccessToken } from '@/lib/api/client';
import { logout } from '@/lib/api/auth';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { cn } from '@/lib/utils';

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { isSidebarCollapsed } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const isAdmin = hasPermission(user.roles, 'admin');
    const isPartner = user.roles.some((r) => r.apiName === PARTNER_ROLE);

    if (!isAdmin && !isPartner) {
      setAccessToken(null);
      logout().catch(() => {});
      router.push('/auth/login?error=unauthorized');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = hasPermission(user.roles, 'admin');
  const isPartner = user.roles.some((r) => r.apiName === PARTNER_ROLE);

  if (!isAdmin && !isPartner) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main
        className={cn(
          'flex-1 w-full min-h-screen p-8 transition-[margin] duration-300 ease-in-out',
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72',
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardInner>{children}</DashboardInner>
    </DashboardProvider>
  );
}
