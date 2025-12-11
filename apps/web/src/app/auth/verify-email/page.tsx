'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail, getCsrfToken } from '@/lib/api/auth';
import { setCsrfToken } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<
    'idle' | 'verifying' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string>('');

  // Use a ref to prevent double execution in strict mode
  const hasVerified = useRef(false);

  useEffect(() => {
    // If no token, show error immediately
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação inválido ou ausente.');
      return;
    }

    // Prevent double calling
    if (hasVerified.current) return;

    const verify = async () => {
      hasVerified.current = true;
      setStatus('verifying');
      try {
        // 1. Fetch CSRF token bound to this specific verification token
        // This ensures the backend generates a hash that matches the session ID (the bearer token)
        const csrfResponse = await getCsrfToken(token);

        // 2. Set the token globally so apiClient uses it
        setCsrfToken(csrfResponse.data.csrfToken);

        // 3. Perform verification with matching Bearer and CSRF tokens
        await verifyEmail(token);

        setStatus('success');
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setMessage(
          err.message || 'Falha ao verificar email. O link pode ter expirado.',
        );
      }
    };

    verify();
  }, [token]);

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-center text-red-600">
            Link Inválido
          </CardTitle>
          <CardDescription className="text-center">
            Não foi possível encontrar o token de verificação.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {status === 'verifying' || status === 'idle' ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500" />
          )}
        </div>
        <CardTitle className="text-2xl text-center">
          {status === 'verifying' || status === 'idle'
            ? 'Verificando Email...'
            : status === 'success'
              ? 'Email Verificado!'
              : 'Falha na Verificação'}
        </CardTitle>
        <CardDescription className="text-center">
          {status === 'verifying' || status === 'idle'
            ? 'Aguarde enquanto confirmamos seu endereço de email.'
            : status === 'success'
              ? 'Sua conta foi verificada com sucesso. Você já pode acessar todos os recursos no aplicativo móvel.'
              : message}
        </CardDescription>
      </CardHeader>
      {status !== 'verifying' && status !== 'idle' && (
        <CardFooter className="flex justify-center">
          {/* Optional: Add button to home or login if desired */}
        </CardFooter>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
