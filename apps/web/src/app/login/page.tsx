'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  correo_institucional: z.string().email('Correo inválido'),
  contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, refresh_token, usuario } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      document.cookie = `access_token=${access_token}; path=/; SameSite=Lax`;

      setAuth(
        {
          id: usuario.id,
          correo_institucional: usuario.correo_institucional,
          nombres: usuario.nombres,
          apellido_paterno: usuario.apellido_paterno,
          apellido_materno: usuario.apellido_materno,
          rol: usuario.rol?.nombre,
        },
        access_token,
        refresh_token,
      );

      toast({
        title: 'Bienvenido',
        description: `Hola, ${usuario.nombres}`,
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de inicio de sesión',
        description: error.response?.data?.message || 'Credenciales inválidas',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Sistema de Gestión de Tesis - UNT
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
              <Label htmlFor="contrasena">Contraseña</Label>
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
            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-primary hover:underline font-medium">
                Regístrate
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
