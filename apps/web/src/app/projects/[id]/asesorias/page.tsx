'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Calendar, Clock, CheckCircle } from 'lucide-react';

interface Asesoria {
  id: string;
  tipo: string;
  fecha_programada: string;
  fecha_realizada?: string;
  estado: string;
  descripcion?: string;
  conclusiones?: string;
  asesor: {
    nombres: string;
    apellido_paterno: string;
  };
}

const tipoColors = {
  PLANIFICACION: 'bg-blue-100 text-blue-800',
  MARCO_TEORICO: 'bg-purple-100 text-purple-800',
  METODOLOGIA: 'bg-green-100 text-green-800',
  RESULTADOS: 'bg-yellow-100 text-yellow-800',
  REDACCION: 'bg-orange-100 text-orange-800',
  GENERAL: 'bg-gray-100 text-gray-800',
};

const estadoColors = {
  PROGRAMADA: 'bg-blue-100 text-blue-800',
  REALIZADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
  REPROGRAMADA: 'bg-yellow-100 text-yellow-800',
};

export default function AsesoriasPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [asesorias, setAsesorias] = useState<Asesoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'GENERAL',
    fecha_programada: '',
    descripcion: '',
    duracion_minutos: 60,
  });

  useEffect(() => {
    fetchAsesorias();
  }, [params.id]);

  const fetchAsesorias = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/proyectos/asesorias/proyecto/${params.id}`);
      setAsesorias(response.data);
    } catch (error) {
      toast.error('Error al cargar asesorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha_programada) {
      toast.error('La fecha es obligatoria');
      return;
    }

    try {
      const payload = {
        ...formData,
        proyecto_id: params.id,
        asesor_id: user?.id,
        fecha_programada: new Date(formData.fecha_programada).toISOString(),
      };

      await api.post('/proyectos/asesorias', payload);
      toast.success('Asesoría programada exitosamente');
      setShowForm(false);
      setFormData({ tipo: 'GENERAL', fecha_programada: '', descripcion: '', duracion_minutos: 60 });
      fetchAsesorias();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear asesoría');
    }
  };

  const completarAsesoria = async (id: string, conclusiones: string) => {
    try {
      await api.post(`/proyectos/asesorias/${id}/completar`, { conclusiones });
      toast.success('Asesoría completada');
      fetchAsesorias();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al completar asesoría');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Proyecto
        </Button>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancelar' : 'Nueva Asesoría'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Programar Nueva Asesoría</CardTitle>
            <CardDescription>Completa el formulario para programar una sesión de asesoría</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Asesoría</Label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="PLANIFICACION">Planificación</option>
                  <option value="MARCO_TEORICO">Marco Teórico</option>
                  <option value="METODOLOGIA">Metodología</option>
                  <option value="RESULTADOS">Resultados</option>
                  <option value="REDACCION">Redacción</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_programada">Fecha y Hora *</Label>
                <Input
                  id="fecha_programada"
                  type="datetime-local"
                  value={formData.fecha_programada}
                  onChange={(e) => setFormData({ ...formData, fecha_programada: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe los temas a tratar en la asesoría"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion">Duración (minutos)</Label>
                <Input
                  id="duracion"
                  type="number"
                  value={formData.duracion_minutos}
                  onChange={(e) => setFormData({ ...formData, duracion_minutos: parseInt(e.target.value) })}
                  min="15"
                  step="15"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">Programar Asesoría</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de Asesorías ({asesorias.length})</CardTitle>
          <CardDescription>Registro de todas las sesiones de asesoría</CardDescription>
        </CardHeader>
        <CardContent>
          {asesorias.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay asesorías programadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {asesorias.map((asesoria) => (
                <div key={asesoria.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoColors[asesoria.tipo as keyof typeof tipoColors]}`}>
                          {asesoria.tipo}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[asesoria.estado as keyof typeof estadoColors]}`}>
                          {asesoria.estado}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Clock className="h-4 w-4 mr-2" />
                        {new Date(asesoria.fecha_programada).toLocaleString()}
                      </div>
                      {asesoria.fecha_realizada && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Realizada: {new Date(asesoria.fecha_realizada).toLocaleString()}
                        </div>
                      )}
                    </div>
                    {asesoria.estado === 'PROGRAMADA' && user?.rol === 'ASESOR' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const conclusiones = prompt('Ingresa las conclusiones de la asesoría:');
                          if (conclusiones) completarAsesoria(asesoria.id, conclusiones);
                        }}
                      >
                        Completar
                      </Button>
                    )}
                  </div>
                  {asesoria.descripcion && (
                    <p className="text-sm text-gray-700 mb-2">{asesoria.descripcion}</p>
                  )}
                  {asesoria.conclusiones && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Conclusiones:</p>
                      <p className="text-sm text-gray-700">{asesoria.conclusiones}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
