import { Role } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShieldCheck, Building2, User } from 'lucide-react';
import { pt } from '@/locales/pt';

export function UserRolesCell({ roles }: { roles: Role[] }) {
  const isAdmin = roles.some(
    (r) => r.apiName.includes('administrator') || r.apiName === 'admin',
  );
  const isPartner = roles.some((r) => r.apiName === 'partner');

  const tRoles = pt.roles;

  // Extract specific admin areas
  const adminAreas = roles
    .filter((r) => r.apiName.includes('administrator') || r.apiName === 'admin')
    .map((r) => {
      if (r.apiName === 'admin') return tRoles.areas.admin;
      const key = r.apiName.replace(
        '-administrator',
        '',
      ) as keyof typeof tRoles.areas;
      return tRoles.areas[key] || key;
    });

  // Extract user permissions
  const userPermissions = roles
    .filter((r) => {
      // Check if the role exists in our 'user' roles map
      return (tRoles.user as any)[r.apiName];
    })
    .map((r) => (tRoles.user as any)[r.apiName]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {isAdmin && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="default"
                  className="gap-1 px-2 bg-purple-600 hover:bg-purple-700"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold mb-1">Permissões de Gestão:</p>
                <ul className="list-disc pl-4 text-xs">
                  {adminAreas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {isPartner && (
          <Badge
            variant="secondary"
            className="gap-1 px-2 bg-green-100 text-green-800 border-green-200"
          >
            <Building2 className="h-3 w-3" />
            Parceiro
          </Badge>
        )}

        {!isAdmin && !isPartner && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="gap-1 px-2">
                  <User className="h-3 w-3" />
                  Usuário
                </Badge>
              </TooltipTrigger>
              {userPermissions.length > 0 && (
                <TooltipContent>
                  <p className="font-bold mb-1">Permissões de Acesso:</p>
                  <ul className="list-disc pl-4 text-xs">
                    {userPermissions.map((perm) => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {isAdmin && (
        <span
          className="text-[10px] text-muted-foreground truncate max-w-[150px]"
          title={adminAreas.join(', ')}
        >
          {adminAreas.join(', ')}
        </span>
      )}
      {!isAdmin && !isPartner && userPermissions.length > 0 && (
        <span
          className="text-[10px] text-muted-foreground truncate max-w-[150px]"
          title={userPermissions.join(', ')}
        >
          {userPermissions.slice(0, 2).join(', ')}
          {userPermissions.length > 2 ? '...' : ''}
        </span>
      )}
    </div>
  );
}
