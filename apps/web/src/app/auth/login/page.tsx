'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login, logout } from '@/lib/api/auth';
import { useAuth } from '@/context/AuthContext';
import { useCsrf } from '@/context/CsrfContext';
import { setAccessToken } from '@/lib/api/client';
import { ADMIN_ROLES, PARTNER_ROLE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Link from 'next/link';

const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(3, 'Email deve ter no mínimo 3 caracteres')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(64, 'Senha deve ter no máximo 64 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { isLoading: isCsrfLoading } = useCsrf();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError(
        'Acesso negado. Apenas administradores e parceiros podem acessar este painel.',
      );
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await login(data);
      const userRoles = response.data.user.roles;

      const isAdmin = userRoles.some((r) =>
        (ADMIN_ROLES as readonly string[]).includes(r.apiName),
      );
      const isPartner = userRoles.some((r) => r.apiName === PARTNER_ROLE);

      if (!isAdmin && !isPartner) {
        setAccessToken(null);
        setError(
          'Acesso negado. Apenas administradores e parceiros podem acessar este painel.',
        );
        return;
      }

      setAccessToken(response.data.accessToken);
      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      setError('Email ou senha incorretos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || isCsrfLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Entre com seu email e senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Senha
            </label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-muted-foreground hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isLoading
              ? 'Entrando...'
              : isCsrfLoading
                ? 'Carregando segurança...'
                : 'Entrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
