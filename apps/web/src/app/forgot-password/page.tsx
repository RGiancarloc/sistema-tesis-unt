'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  correo_institucional: z.string().email('Correo inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setIsSuccess(true);
      toast({
        title: 'Correo enviado',
        description: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo enviar el correo de recuperación',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSuccess ? 'Correo Enviado' : 'Recuperar Contraseña'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess
              ? 'Revisa tu correo para continuar'
              : 'Ingresa tu correo para recuperar tu contraseña'}
          </CardDescription>
        </CardHeader>
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Institucional</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="estudiante@unt.edu.pe"
                  {...register('correo_institucional')}
                  disabled={isLoading}
                />
                {errors.correo_institucional && (
                  <p className="text-sm text-destructive">{errors.correo_institucional.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Correo
              </Button>
              <a href="/login" className="text-sm text-center text-muted-foreground hover:underline">
                Volver al login
              </a>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4 py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center text-muted-foreground">
                Hemos enviado un correo con instrucciones para restablecer tu contraseña.
              </p>
            </div>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsSuccess(false)}
              >
                Enviar otro correo
              </Button>
              <a href="/login" className="text-sm text-center text-muted-foreground hover:underline">
                Volver al login
              </a>
            </CardFooter>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
