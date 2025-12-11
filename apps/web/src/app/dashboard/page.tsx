'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  Unlock,
  ArrowUpRight,
  Users,
  MapPin,
  MessageSquare,
  Handshake,
  FileText, // Added for Suggestions
  ShieldAlert, // Added for Reports
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { hasPermission } from '@/lib/constants';

const ADMIN_DASHBOARD_LINKS = [
  {
    sectionTitle: 'Gestão de Utilizadores',
    roles: ['admin', 'users-administrator'],
    items: [
      { 
        title: 'Utilizadores', 
        href: '/dashboard/users', 
        icon: Users, 
        desc: 'Ver, editar e gerir contas de utilizadores.' 
      },
      { 
        title: 'Denúncias de Utilizadores', 
        href: '/dashboard/reports/users', 
        icon: ShieldAlert, 
        desc: 'Analisar e resolver denúncias sobre comportamentos de utilizadores.' 
      },
    ]
  },
  {
    sectionTitle: 'Gestão de Conteúdo (Casas de Banho)',
    roles: ['admin', 'toilets-administrator'],
    items: [
      { 
        title: 'Denúncias de Casas de Banho', 
        href: '/dashboard/reports/toilets', 
        icon: ShieldAlert, 
        desc: 'Analisar e resolver denúncias sobre informações ou estado de casas de banho.' 
      },
      { 
        title: 'Sugestões de Casas de Banho', 
        href: '/dashboard/suggestions', 
        icon: FileText, 
        desc: 'Rever, aprovar ou rejeitar sugestões de novos locais ou edições.' 
      },
    ]
  },
  {
    sectionTitle: 'Moderação de Comentários e Respostas',
    roles: ['admin', 'comments-administrator'],
    items: [
      { 
        title: 'Denúncias de Comentários', 
        href: '/dashboard/reports/comments', 
        icon: MessageSquare, 
        desc: 'Moderar e resolver denúncias de conteúdo em comentários.' 
      },
      { 
        title: 'Denúncias de Respostas', 
        href: '/dashboard/reports/replies', 
        icon: MessageSquare, 
        desc: 'Moderar e resolver denúncias de conteúdo em respostas.' 
      },
    ]
  },
  {
    sectionTitle: 'Gestão de Parceiros', // Keep if still relevant
    roles: ['admin', 'partners-administrator', 'partner'], // partner role can see this section
    items: [
      { 
        title: 'Candidaturas de Parceiros', // Updated title if managing applications
        href: '/dashboard/partners', 
        icon: Handshake, 
        desc: 'Aprovar novas parcerias comerciais e verificar contratos.' 
      },
      { // Assuming 'my-toilet' is for partners to manage their own toilet
        title: 'Minha Casa de Banho (Parceiro)',
        href: '/dashboard/my-toilet',
        icon: Building2,
        desc: 'Gerir informações e reviews da sua própria casa de banho parceira.',
        roles: ['partner'], // Only visible to 'partner' role, not general admin
      },
    ]
  }
];

export default function DashboardPage() {
  const { user, roles } = useAuth();

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[var(--secondary)] p-8 md:p-10 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <span className="text-xs font-medium capitalize">
              {new Date().toLocaleDateString('pt-PT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            {getGreeting()}, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-white/90 text-lg max-w-2xl leading-relaxed font-light">
            Este é o seu painel de controlo. Abaixo encontra os módulos ativos
            para o seu nível de acesso.
          </p>
        </div>
        {/* Abstract shapes for visual flair */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl mix-blend-overlay"></div>
      </div>

      {/* Access Modules Grid */}
      {ADMIN_DASHBOARD_LINKS.map((section, sectionIdx) => {
        // Only render section if user has access to at least one item in it
        const hasSectionAccess = section.items.some(item => {
            const allowedRoles = item.roles || section.roles;
            return allowedRoles.some(role => hasPermission(roles, role));
        });

        if (!hasSectionAccess) return null;

        return (
          <div key={sectionIdx} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock size={18} className="text-muted-foreground" />
              {section.sectionTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, itemIdx) => {
                const allowedRoles = item.roles || section.roles;
                const hasItemAccess = allowedRoles.some(role => hasPermission(roles, role));

                return (
                  <Card
                    key={itemIdx}
                    className={`relative overflow-hidden transition-all border-l-4 ${
                      hasItemAccess
                        ? 'hover:shadow-md border-l-primary'
                        : 'opacity-60 bg-muted/50 border-l-muted-foreground/20'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div
                          className={`p-3 rounded-xl ${hasItemAccess ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                        >
                          <item.icon size={24} />
                        </div>
                        {hasItemAccess ? (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                          >
                            <Unlock size={10} /> Ativo
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1 text-muted-foreground"
                          >
                            <Lock size={10} /> Bloqueado
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg font-bold mt-4">
                        {item.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="min-h-[40px]">
                        {item.desc}
                      </CardDescription>
                    </CardContent>

                    <CardFooter>
                      {hasItemAccess ? (
                        <Link href={item.href} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full justify-between group"
                          >
                            Aceder
                            <ArrowUpRight
                              size={16}
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="ghost"
                          disabled
                          className="w-full justify-between cursor-not-allowed"
                        >
                          Sem Permissão
                          <Lock size={16} />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}