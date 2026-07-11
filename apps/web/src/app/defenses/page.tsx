'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Plus, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Sustentacion {
  id: string;
  titulo: string;
  estado: string;
  fecha_programada: string;
  fecha_realizada: string;
  modalidad: string;
  ubicacion: string;
  proyecto: {
    titulo: string;
  };
}

const estadoColors = {
  PROGRAMADA: 'bg-blue-100 text-blue-800',
  EN_PROGRESO: 'bg-yellow-100 text-yellow-800',
  SUSPENDIDA: 'bg-orange-100 text-orange-800',
  APROBADA: 'bg-green-100 text-green-800',
  REPROBADA: 'bg-red-100 text-red-800',
  CANCELADA: 'bg-gray-100 text-gray-800',
};

const estadoLabels = {
  PROGRAMADA: 'Programada',
  EN_PROGRESO: 'En Progreso',
  SUSPENDIDA: 'Suspendida',
  APROBADA: 'Aprobada',
  REPROBADA: 'Reprobada',
  CANCELADA: 'Cancelada',
};

export default function DefensesPage() {
  const params = useParams();
  const { user } = useAuth();
  const [sustentaciones, setSustentaciones] = useState<Sustentacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSustentaciones(params.id as string);
    }
  }, [params.id]);

  const fetchSustentaciones = async (proyectoId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/sustentaciones/proyecto/${proyectoId}`);
      setSustentaciones(response.data);
    } catch (error) {
      toast.error('Error al cargar sustentaciones');
    } finally {
      setIsLoading(false);
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sustentaciones</h1>
          <p className="text-gray-600 mt-2">Gestiona las sustentaciones del proyecto</p>
        </div>
        {(user?.rol === 'COORDINADOR' || user?.rol === 'DECANO') && (
          <Button onClick={() => window.location.href = `/defenses/${params.id}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Programar Sustentación
          </Button>
        )}
      </div>

      {sustentaciones.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay sustentaciones</h3>
            <p className="text-gray-600 text-center mb-4">
              Aún no se ha programado ninguna sustentación
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sustentaciones.map((sustentacion) => (
            <Card key={sustentacion.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/defenses/${params.id}/${sustentacion.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{sustentacion.titulo}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[sustentacion.estado as keyof typeof estadoColors]}`}>
                    {estadoLabels[sustentacion.estado as keyof typeof estadoLabels]}
                  </span>
                </div>
                <CardDescription>
                  {sustentacion.modalidad}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(sustentacion.fecha_programada).toLocaleString()}
                  </div>
                  {sustentacion.ubicacion && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {sustentacion.ubicacion}
                    </div>
                  )}
                  {sustentacion.fecha_realizada && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Realizada: {new Date(sustentacion.fecha_realizada).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
