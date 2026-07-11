'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Send, Check, X, Upload, FileText, Calendar, Clock } from 'lucide-react';

interface Informe {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  numero_version: number;
  fecha_inicio: string;
  fecha_limite: string;
  fecha_entrega: string;
  fecha_aprobacion: string;
  comentario_asesor: string;
  proyecto: {
    titulo: string;
  };
  versiones: any[];
  revisiones: any[];
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

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [informe, setInforme] = useState<Informe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInforme();
  }, [params.informeId]);

  const fetchInforme = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/informes/${params.informeId}`);
      setInforme(response.data);
    } catch (error) {
      toast.error('Error al cargar el informe');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const enviarRevision = async () => {
    try {
      await api.post(`/informes/${params.informeId}/enviar-revision`);
      toast.success('Informe enviado a revisión');
      fetchInforme();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al enviar');
    }
  };

  const aprobarInforme = async () => {
    try {
      await api.post(`/informes/${params.informeId}/aprobar`);
      toast.success('Informe aprobado');
      fetchInforme();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al aprobar');
    }
  };

  const rechazarInforme = async () => {
    const comentario = prompt('Ingresa el motivo del rechazo:');
    if (!comentario) return;
    try {
      await api.post(`/informes/${params.informeId}/rechazar`, { comentario });
      toast.success('Informe rechazado');
      fetchInforme();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al rechazar');
    }
  };

  const finalizarInforme = async () => {
    try {
      await api.post(`/informes/${params.informeId}/finalizar`);
      toast.success('Informe finalizado');
      fetchInforme();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al finalizar');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!informe) return null;

  const canEnviarRevision = user?.rol === 'ESTUDIANTE' && informe.estado === 'BORRADOR';
  const canAprobar = user?.rol === 'ASESOR' && informe.estado === 'EN_REVISION';
  const canFinalizar = (user?.rol === 'COORDINADOR' || user?.rol === 'ESTUDIANTE') && informe.estado === 'APROBADO';

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{informe.titulo}</CardTitle>
                <CardDescription>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[informe.estado as keyof typeof estadoColors]}`}>
                    {estadoLabels[informe.estado as keyof typeof estadoLabels]}
                  </span>
                  <span className="ml-2">Versión {informe.numero_version}</span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {canEnviarRevision && (
                  <Button onClick={enviarRevision}>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar a Revisión
                  </Button>
                )}
                {canAprobar && (
                  <>
                    <Button onClick={aprobarInforme}>
                      <Check className="mr-2 h-4 w-4" />
                      Aprobar
                    </Button>
                    <Button onClick={rechazarInforme} variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Rechazar
                    </Button>
                  </>
                )}
                {canFinalizar && (
                  <Button onClick={finalizarInforme}>
                    <Check className="mr-2 h-4 w-4" />
                    Finalizar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {informe.descripcion && (
              <p className="text-gray-700 mb-4">{informe.descripcion}</p>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Inicio</p>
                <p className="font-medium">{informe.fecha_inicio ? new Date(informe.fecha_inicio).toLocaleDateString() : 'No definido'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Límite</p>
                <p className="font-medium">{informe.fecha_limite ? new Date(informe.fecha_limite).toLocaleDateString() : 'No definido'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entrega</p>
                <p className="font-medium">{informe.fecha_entrega ? new Date(informe.fecha_entrega).toLocaleDateString() : 'No entregado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {informe.comentario_asesor && (
          <Card>
            <CardHeader>
              <CardTitle>Comentario del Asesor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{informe.comentario_asesor}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Versiones ({informe.versiones?.length || 0})
            </CardTitle>
            <CardDescription>Historial de versiones del informe</CardDescription>
          </CardHeader>
          <CardContent>
            {informe.versiones?.length === 0 ? (
              <p className="text-gray-500">No hay versiones cargadas</p>
            ) : (
              <div className="space-y-2">
                {informe.versiones.map((version) => (
                  <div key={version.id} className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{version.nombre_archivo}</p>
                      <p className="text-sm text-gray-600">
                        Versión {version.numero_version} • {(version.tamano_bytes / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {user?.rol === 'ESTUDIANTE' && (
              <Button className="mt-4" onClick={() => window.location.href = `/reports/${params.proyectoId}/${params.informeId}/upload`}>
                <Upload className="mr-2 h-4 w-4" />
                Subir Nueva Versión
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Revisiones ({informe.revisiones?.length || 0})
            </CardTitle>
            <CardDescription>Registro de revisiones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {informe.revisiones?.length === 0 ? (
              <p className="text-gray-500">No hay revisiones registradas</p>
            ) : (
              <div className="space-y-2">
                {informe.revisiones.map((revision) => (
                  <div key={revision.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{revision.revisor?.nombres} {revision.revisor?.apellido_paterno}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        revision.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                        revision.estado === 'RECHAZADA' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {revision.estado}
                      </span>
                    </div>
                    {revision.comentarios && <p className="text-sm text-gray-700">{revision.comentarios}</p>}
                    {revision.conformidad !== undefined && (
                      <p className="text-sm mt-2">
                        Conformidad: <span className={revision.conformidad ? 'text-green-600' : 'text-red-600'}>
                          {revision.conformidad ? 'Sí' : 'No'}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
