'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const registerSchema = z
  .object({
    correo_institucional: z.string().email('Correo inválido'),
    contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmar_contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
    nombres: z.string().min(2, 'Mínimo 2 caracteres'),
    apellido_paterno: z.string().min(2, 'Mínimo 2 caracteres'),
    apellido_materno: z.string().optional(),
    dni: z.string().length(8, 'DNI debe tener 8 dígitos').optional(),
    telefono: z.string().optional(),
  })
  .refine((data) => data.contrasena === data.confirmar_contrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar_contrasena'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmar_contrasena, ...registerData } = data;
      await api.post('/auth/register', registerData);

      toast.success('Registro exitoso. Tu cuenta ha sido creada. Por favor inicia sesión.');

      router.push('/login');
    } catch (error: any) {
      toast.error('Error de registro: ' + (error.response?.data?.message || 'No se pudo crear la cuenta'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input
                  id="nombres"
                  placeholder="Juan"
                  {...register('nombres')}
                  disabled={isLoading}
                />
                {errors.nombres && (
                  <p className="text-sm text-destructive">{errors.nombres.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                <Input
                  id="apellido_paterno"
                  placeholder="Pérez"
                  {...register('apellido_paterno')}
                  disabled={isLoading}
                />
                {errors.apellido_paterno && (
                  <p className="text-sm text-destructive">{errors.apellido_paterno.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido_materno">Apellido Materno (opcional)</Label>
              <Input
                id="apellido_materno"
                placeholder="López"
                {...register('apellido_materno')}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI (opcional)</Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678"
                  {...register('dni')}
                  disabled={isLoading}
                />
                {errors.dni && <p className="text-sm text-destructive">{errors.dni.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+51 999 999 999"
                  {...register('telefono')}
                  disabled={isLoading}
                />
              </div>
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
              Registrarse
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-primary hover:underline font-medium">
                Inicia sesión
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
