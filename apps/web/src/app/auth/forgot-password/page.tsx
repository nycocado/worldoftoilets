'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(3, 'Email deve ter no mínimo 3 caracteres')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoading: isCsrfLoading } = useCsrf();

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
      // If API returns validation errors, we might see them here.
      // We'll display the generic error message from the API or a fallback.
      setError(
        err.message ||
          'Ocorreu um erro ao tentar enviar o email. Tente novamente.',
      );
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
            Email Enviado!
          </CardTitle>
          <CardDescription className="text-center">
            Se o email informado estiver cadastrado, você receberá um link para
            redefinir sua senha.
            <br />
            Verifique também sua caixa de spam.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Recuperar Senha</CardTitle>
        <CardDescription className="text-center">
          Digite seu email abaixo para recebermos um link de redefinição de
          senha.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
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
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : isCsrfLoading ? (
              'Carregando segurança...'
            ) : (
              'Enviar Link'
            )}
          </Button>
          <Link href="/auth/login" className="w-full">
            <Button variant="ghost" className="w-full" type="button">
              Voltar
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
