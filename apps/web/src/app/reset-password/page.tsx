'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    correo_institucional: z.string().email('Correo inválido'),
    token: z.string().min(1, 'Token requerido'),
    contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmar_contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
  })
  .refine((data) => data.contrasena === data.confirmar_contrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar_contrasena'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      correo_institucional: emailFromUrl,
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', data);

      toast({
        title: 'Contraseña restablecida',
        description: 'Tu contraseña ha sido actualizada exitosamente.',
      });

      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo restablecer la contraseña',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Restablecer Contraseña</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu nueva contraseña
          </CardDescription>
        </CardHeader>
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
            <div className="space-y-2">
              <Label htmlFor="token">Token de recuperación</Label>
              <Input
                id="token"
                type="text"
                placeholder="Token del correo"
                {...register('token')}
                disabled={isLoading}
              />
              {errors.token && <p className="text-sm text-destructive">{errors.token.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contrasena">Nueva Contraseña</Label>
              <Input
                id="contrasena"
                type="password"
                placeholder="••••••••"
                {...register('contrasena')}
                disabled={isLoading}
              />
              {errors.contrasena && (
                <p className="text-sm text-destructive">{errors.contrasena.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar_contrasena">Confirmar Contraseña</Label>
              <Input
                id="confirmar_contrasena"
                type="password"
                placeholder="••••••••"
                {...register('confirmar_contrasena')}
                disabled={isLoading}
              />
              {errors.confirmar_contrasena && (
                <p className="text-sm text-destructive">{errors.confirmar_contrasena.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restablecer Contraseña
            </Button>
            <a href="/login" className="text-sm text-center text-muted-foreground hover:underline">
              Volver al login
            </a>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
