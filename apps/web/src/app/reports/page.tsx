'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Plus, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';

interface Informe {
  id: string;
  titulo: string;
  estado: string;
  fecha_inicio: string;
  fecha_limite: string;
  fecha_entrega: string;
  numero_version: number;
  proyecto: {
    titulo: string;
  };
}

const estadoColors = {
  BORRADOR: 'bg-gray-100 text-gray-800',
  EN_REVISION: 'bg-blue-100 text-blue-800',
  APROBADO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-red-100 text-red-800',
  FINALIZADO: 'bg-green-100 text-green-800',
  ENTREGADO: 'bg-purple-100 text-purple-800',
};

const estadoLabels = {
  BORRADOR: 'Borrador',
  EN_REVISION: 'En Revisión',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  FINALIZADO: 'Finalizado',
  ENTREGADO: 'Entregado',
};

export default function ReportsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [informes, setInformes] = useState<Informe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInformes(params.id as string);
    }
  }, [params.id]);

  const fetchInformes = async (proyectoId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/informes/proyecto/${proyectoId}`);
      setInformes(response.data);
    } catch (error) {
      toast.error('Error al cargar informes');
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
          <h1 className="text-3xl font-bold">Informes de Tesis</h1>
          <p className="text-gray-600 mt-2">Gestiona los informes de tu proyecto</p>
        </div>
        {user?.rol === 'ESTUDIANTE' && (
          <Button onClick={() => window.location.href = `/reports/${params.id}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Informe
          </Button>
        )}
      </div>

      {informes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay informes</h3>
            <p className="text-gray-600 text-center mb-4">
              Aún no has creado ningún informe de tesis
            </p>
            {user?.rol === 'ESTUDIANTE' && (
              <Button onClick={() => window.location.href = `/reports/${params.id}/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Informe
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {informes.map((informe) => (
            <Card key={informe.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/reports/${params.id}/${informe.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{informe.titulo}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[informe.estado as keyof typeof estadoColors]}`}>
                    {estadoLabels[informe.estado as keyof typeof estadoLabels]}
                  </span>
                </div>
                <CardDescription>
                  Versión {informe.numero_version}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Inicio: {informe.fecha_inicio ? new Date(informe.fecha_inicio).toLocaleDateString() : 'No definido'}
                  </div>
                  {informe.fecha_limite && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Límite: {new Date(informe.fecha_limite).toLocaleDateString()}
                    </div>
                  )}
                  {informe.fecha_entrega && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Entregado: {new Date(informe.fecha_entrega).toLocaleDateString()}
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
