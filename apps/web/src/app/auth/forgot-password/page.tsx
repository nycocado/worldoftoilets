'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { forgotPassword } from '@/lib/api/auth';
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
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { pt } from '@/locales/pt';

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoading: isCsrfLoading } = useCsrf();

  const t = pt.auth.forgotPassword;
  const tValidation = pt.auth.validation;
  const tLogin = pt.auth.login;

  // Since we can't easily use hooks inside zod schema definition if it's outside component,
  // we define schema inside or use static strings. For now, static strings from pt.ts directly imported is fine.
  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .email(tValidation.emailInvalid)
      .min(3, tValidation.emailMin)
      .max(100, tValidation.emailMax),
  });

  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errors.sendError);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || isCsrfLoading;

  if (isSuccess) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-xl text-center text-green-600">
            {t.linkSentTitle}
          </CardTitle>
          <CardDescription
            className="text-center"
            dangerouslySetInnerHTML={{ __html: t.linkSentDescription }}
          />
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToLogin}
            </Button>
          </Link>
        </CardFooter>
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
            <label htmlFor="email" className="text-sm font-medium">
              {tLogin.emailLabel}
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
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.submitting}
              </>
            ) : isCsrfLoading ? (
              tLogin.loading
            ) : (
              t.submit
            )}
          </Button>
          <Link href="/auth/login" className="w-full">
            <Button variant="ghost" className="w-full" type="button">
              {t.back}
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
