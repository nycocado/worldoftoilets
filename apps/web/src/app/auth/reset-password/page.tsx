'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { resetPassword } from '@/lib/api/auth';
import { useCsrf } from '@/context/CsrfContext';
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
import { pt } from '@/locales/pt';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { isLoading: isCsrfLoading } = useCsrf();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = pt.auth.resetPassword;
  const tValidation = pt.auth.validation;

  const resetPasswordSchema = z
    .object({
      password: z.string().min(8, tValidation.passwordMin),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.errors.mismatch,
      path: ['confirmPassword'],
    });

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(t.errors.tokenInvalid);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await resetPassword(token, data.password);
      setSuccess(true);
    } catch (err) {
      setError(t.errors.generic);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || isCsrfLoading;

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-red-600">{t.errorTitle}</CardTitle>
          <CardDescription>{t.errorToken}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-green-600">
            {t.successTitle}
          </CardTitle>
          <CardDescription>{t.successDescription}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t.confirmPasswordLabel}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isLoading
              ? t.submitting
              : isCsrfLoading
                ? pt.auth.login.loading
                : t.submit}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
