'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Proyecto {
  id: string;
  titulo: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  estudiante: {
    nombres: string;
    apellido_paterno: string;
  };
  asesor?: {
    nombres: string;
    apellido_paterno: string;
  };
}

const estadoColors = {
  BORRADOR: 'bg-gray-100 text-gray-800',
  ENVIADO_ASESOR: 'bg-blue-100 text-blue-800',
  APROBADO_ASESOR: 'bg-green-100 text-green-800',
  RECHAZADO_ASESOR: 'bg-red-100 text-red-800',
  ENVIADO_COORDINADOR: 'bg-purple-100 text-purple-800',
  APROBADO_COORDINADOR: 'bg-green-100 text-green-800',
  RECHAZADO_COORDINADOR: 'bg-red-100 text-red-800',
  EN_DESARROLLO: 'bg-yellow-100 text-yellow-800',
  FINALIZADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-gray-100 text-gray-800',
};

const estadoLabels = {
  BORRADOR: 'Borrador',
  ENVIADO_ASESOR: 'Enviado a Asesor',
  APROBADO_ASESOR: 'Aprobado por Asesor',
  RECHAZADO_ASESOR: 'Rechazado por Asesor',
  ENVIADO_COORDINADOR: 'Enviado a Coordinador',
  APROBADO_COORDINADOR: 'Aprobado por Coordinador',
  RECHAZADO_COORDINADOR: 'Rechazado por Coordinador',
  EN_DESARROLLO: 'En Desarrollo',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProyectos();
  }, [user]);

  const fetchProyectos = async () => {
    try {
      setIsLoading(true);
      const endpoint = user?.rol === 'ASESOR' 
        ? `/proyectos/asesor/${user?.id}`
        : `/proyectos/estudiante/${user?.id}`;
      const response = await api.get(endpoint);
      setProyectos(response.data);
    } catch (error) {
      toast.error('Error al cargar proyectos');
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
          <h1 className="text-3xl font-bold">Mis Proyectos de Tesis</h1>
          <p className="text-gray-600 mt-2">Gestiona tus proyectos de investigación</p>
        </div>
        <Button onClick={() => window.location.href = '/projects/new'}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {proyectos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay proyectos</h3>
            <p className="text-gray-600 text-center mb-4">
              {user?.rol === 'ASESOR' 
                ? 'No tienes proyectos asignados como asesor'
                : 'Aún no has creado ningún proyecto de tesis'}
            </p>
            {user?.rol !== 'ASESOR' && (
              <Button onClick={() => window.location.href = '/projects/new'}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Proyecto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto) => (
            <Card key={proyecto.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/projects/${proyecto.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{proyecto.titulo}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[proyecto.estado as keyof typeof estadoColors]}`}>
                    {estadoLabels[proyecto.estado as keyof typeof estadoLabels]}
                  </span>
                </div>
                <CardDescription>
                  {proyecto.asesor 
                    ? `Asesor: ${proyecto.asesor.nombres} ${proyecto.asesor.apellido_paterno}`
                    : 'Sin asesor asignado'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Inicio: {proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString() : 'No definido'}
                  </div>
                  {proyecto.fecha_fin_estimada && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Fin estimado: {new Date(proyecto.fecha_fin_estimada).toLocaleDateString()}
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
