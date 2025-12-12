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
import { pt } from '@/locales/pt';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<
    'idle' | 'verifying' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string>('');

  const hasVerified = useRef(false);
  const t = pt.auth.verifyEmail;

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t.errors.missingToken);
      return;
    }

    if (hasVerified.current) return;

    const verify = async () => {
      hasVerified.current = true;
      setStatus('verifying');
      try {
        const csrfResponse = await getCsrfToken(token);

        setCsrfToken(csrfResponse.data.csrfToken);

        await verifyEmail(token);

        setStatus('success');
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setMessage(err.message || t.errors.generic);
      }
    };

    verify();
  }, [token, t.errors.missingToken, t.errors.generic]);

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-center text-red-600">
            {t.invalidTokenTitle}
          </CardTitle>
          <CardDescription className="text-center">
            {t.invalidTokenDesc}
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
            ? t.titleVerifying
            : status === 'success'
              ? t.titleSuccess
              : t.titleError}
        </CardTitle>
        <CardDescription className="text-center">
          {status === 'verifying' || status === 'idle'
            ? t.descVerifying
            : status === 'success'
              ? t.descSuccess
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
