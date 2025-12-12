'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '@/lib/api/auth';
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
import { pt } from '@/locales/pt';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { isLoading: isCsrfLoading } = useCsrf();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = pt.auth.login;
  const tValidation = pt.auth.validation;

  const loginSchema = z.object({
    email: z
      .string()
      .email(tValidation.emailInvalid)
      .min(3, tValidation.emailMin)
      .max(100, tValidation.emailMax),
    password: z
      .string()
      .min(8, tValidation.passwordMin)
      .max(64, tValidation.passwordMax),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError(t.errors.unauthorized);
    }
  }, [searchParams, t.errors.unauthorized]);

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
        setError(t.errors.unauthorized);
        return;
      }

      setAccessToken(response.data.accessToken);
      await refreshUser();
      router.push('/dashboard');
    } catch (err) {
      setError(t.errors.invalidCredentials);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || isCsrfLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">{t.title}</CardTitle>
        <CardDescription className="text-center">
          {t.description}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t.emailLabel}
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
              {t.passwordLabel}
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
              {t.forgotPassword}
            </Link>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isLoading ? t.submitting : isCsrfLoading ? t.loading : t.submit}
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
