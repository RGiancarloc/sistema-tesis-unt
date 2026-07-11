'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const profileSchema = z.object({
  nombres: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido_paterno: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido_materno: z.string().optional(),
  telefono: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      reset({
        nombres: user.nombres,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno || '',
        telefono: user.telefono || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      await api.put('/usuarios/me', data);
      updateUser(data);
      toast({
        title: 'Perfil actualizado',
        description: 'Tu información ha sido actualizada exitosamente.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el perfil',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Mi Perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Institucional</Label>
                <Input
                  id="correo"
                  type="email"
                  value={user?.correo_institucional || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    {...register('nombres')}
                    disabled={isSaving}
                  />
                  {errors.nombres && (
                    <p className="text-sm text-destructive">{errors.nombres.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                  <Input
                    id="apellido_paterno"
                    {...register('apellido_paterno')}
                    disabled={isSaving}
                  />
                  {errors.apellido_paterno && (
                    <p className="text-sm text-destructive">{errors.apellido_paterno.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido_materno">Apellido Materno</Label>
                <Input
                  id="apellido_materno"
                  {...register('apellido_materno')}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  {...register('telefono')}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Input
                  id="rol"
                  value={user?.rol || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cambios
                </Button>
                <Button type="button" variant="destructive" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
