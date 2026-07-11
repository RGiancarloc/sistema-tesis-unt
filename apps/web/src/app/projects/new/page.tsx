'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    problema_investigacion: '',
    objetivos: '',
    justificacion: '',
    metodologia: '',
    palabras_clave: '',
    fecha_fin_estimada: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo) {
      toast.error('El título es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        estudiante_id: user?.id,
        palabras_clave: formData.palabras_clave.split(',').map(p => p.trim()).filter(p => p),
        fecha_fin_estimada: formData.fecha_fin_estimada ? new Date(formData.fecha_fin_estimada) : undefined,
      };

      const response = await api.post('/proyectos', payload);
      toast.success('Proyecto creado exitosamente');
      router.push(`/projects/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo Proyecto de Tesis</CardTitle>
          <CardDescription>Completa el formulario para registrar tu proyecto de investigación</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del Proyecto *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: Desarrollo de un sistema de gestión de tesis"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción General</Label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción breve del proyecto"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problema">Problema de Investigación</Label>
              <textarea
                id="problema"
                value={formData.problema_investigacion}
                onChange={(e) => setFormData({ ...formData, problema_investigacion: e.target.value })}
                placeholder="Describe el problema que tu investigación abordará"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos">Objetivos</Label>
              <textarea
                id="objetivos"
                value={formData.objetivos}
                onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                placeholder="Objetivo general y objetivos específicos"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificacion">Justificación</Label>
              <textarea
                id="justificacion"
                value={formData.justificacion}
                onChange={(e) => setFormData({ ...formData, justificacion: e.target.value })}
                placeholder="¿Por qué es importante esta investigación?"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodologia">Metodología</Label>
              <textarea
                id="metodologia"
                value={formData.metodologia}
                onChange={(e) => setFormData({ ...formData, metodologia: e.target.value })}
                placeholder="Describe la metodología que utilizarás"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="palabras_clave">Palabras Clave</Label>
              <Input
                id="palabras_clave"
                value={formData.palabras_clave}
                onChange={(e) => setFormData({ ...formData, palabras_clave: e.target.value })}
                placeholder="Separadas por comas (ej: tesis, gestión, software)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin_estimada">Fecha de Finalización Estimada</Label>
              <Input
                id="fecha_fin_estimada"
                type="date"
                value={formData.fecha_fin_estimada}
                onChange={(e) => setFormData({ ...formData, fecha_fin_estimada: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Guardando...' : 'Guardar Proyecto'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
