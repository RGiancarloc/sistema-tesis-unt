'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Send, Check, X, Calendar, User, FileText, Target, BookOpen } from 'lucide-react';

interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  problema_investigacion: string;
  objetivos: string;
  justificacion: string;
  metodologia: string;
  palabras_clave: string[];
  estado: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  fecha_envio_asesor: string;
  fecha_aprobacion_asesor: string;
  comentario_asesor: string;
  estudiante: {
    nombres: string;
    apellido_paterno: string;
    correo_institucional: string;
  };
  asesor?: {
    nombres: string;
    apellido_paterno: string;
    correo_institucional: string;
  };
  asesorias: any[];
  hitos: any[];
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProyecto();
  }, [params.id]);

  const fetchProyecto = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/proyectos/${params.id}`);
      setProyecto(response.data);
    } catch (error) {
      toast.error('Error al cargar el proyecto');
      router.push('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const enviarAAesor = async () => {
    try {
      await api.post(`/proyectos/${params.id}/enviar-asesor`);
      toast.success('Proyecto enviado a asesor');
      fetchProyecto();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al enviar proyecto');
    }
  };

  const aprobarProyecto = async (comentario?: string) => {
    try {
      const endpoint = user?.rol === 'ASESOR' 
        ? `/proyectos/${params.id}/aprobar-asesor`
        : `/proyectos/${params.id}/aprobar-coordinador`;
      await api.post(endpoint, { comentario });
      toast.success('Proyecto aprobado');
      fetchProyecto();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al aprobar proyecto');
    }
  };

  const rechazarProyecto = async (comentario: string) => {
    try {
      const endpoint = user?.rol === 'ASESOR'
        ? `/proyectos/${params.id}/rechazar-asesor`
        : `/proyectos/${params.id}/rechazar-coordinador`;
      await api.post(endpoint, { comentario });
      toast.success('Proyecto rechazado');
      fetchProyecto();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al rechazar proyecto');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!proyecto) {
    return null;
  }

  const canEnviarAAesor = user?.rol === 'ESTUDIANTE' && proyecto.estado === 'BORRADOR';
  const canAprobarAsesor = user?.rol === 'ASESOR' && proyecto.estado === 'ENVIADO_ASESOR';
  const canAprobarCoordinador = user?.rol === 'COORDINADOR' && proyecto.estado === 'ENVIADO_COORDINADOR';

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{proyecto.titulo}</CardTitle>
                <CardDescription>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[proyecto.estado as keyof typeof estadoColors]}`}>
                    {estadoLabels[proyecto.estado as keyof typeof estadoLabels]}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {canEnviarAAesor && (
                  <Button onClick={enviarAAesor}>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar a Asesor
                  </Button>
                )}
                {canAprobarAsesor && (
                  <>
                    <Button onClick={() => aprobarProyecto()} variant="default">
                      <Check className="mr-2 h-4 w-4" />
                      Aprobar
                    </Button>
                    <Button onClick={() => {
                      const comentario = prompt('Ingresa el motivo del rechazo:');
                      if (comentario) rechazarProyecto(comentario);
                    }} variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Rechazar
                    </Button>
                  </>
                )}
                {canAprobarCoordinador && (
                  <>
                    <Button onClick={() => aprobarProyecto()} variant="default">
                      <Check className="mr-2 h-4 w-4" />
                      Aprobar
                    </Button>
                    <Button onClick={() => {
                      const comentario = prompt('Ingresa el motivo del rechazo:');
                      if (comentario) rechazarProyecto(comentario);
                    }} variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Rechazar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Información del Estudiante y Asesor */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5" />
                Estudiante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{proyecto.estudiante.nombres} {proyecto.estudiante.apellido_paterno}</p>
              <p className="text-sm text-gray-600">{proyecto.estudiante.correo_institucional}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5" />
                Asesor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proyecto.asesor ? (
                <>
                  <p className="font-medium">{proyecto.asesor.nombres} {proyecto.asesor.apellido_paterno}</p>
                  <p className="text-sm text-gray-600">{proyecto.asesor.correo_institucional}</p>
                </>
              ) : (
                <p className="text-gray-500">Sin asesor asignado</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fechas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Fechas del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Inicio</p>
                <p className="font-medium">{proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString() : 'No definido'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fin Estimado</p>
                <p className="font-medium">{proyecto.fecha_fin_estimada ? new Date(proyecto.fecha_fin_estimada).toLocaleDateString() : 'No definido'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enviado a Asesor</p>
                <p className="font-medium">{proyecto.fecha_envio_asesor ? new Date(proyecto.fecha_envio_asesor).toLocaleDateString() : 'No enviado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenido del Proyecto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Descripción del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {proyecto.descripcion && (
              <div>
                <h4 className="font-medium mb-2">Descripción General</h4>
                <p className="text-gray-700">{proyecto.descripcion}</p>
              </div>
            )}
            {proyecto.problema_investigacion && (
              <div>
                <h4 className="font-medium mb-2">Problema de Investigación</h4>
                <p className="text-gray-700">{proyecto.problema_investigacion}</p>
              </div>
            )}
            {proyecto.objetivos && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Objetivos
                </h4>
                <p className="text-gray-700 whitespace-pre-line">{proyecto.objetivos}</p>
              </div>
            )}
            {proyecto.justificacion && (
              <div>
                <h4 className="font-medium mb-2">Justificación</h4>
                <p className="text-gray-700">{proyecto.justificacion}</p>
              </div>
            )}
            {proyecto.metodologia && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Metodología
                </h4>
                <p className="text-gray-700">{proyecto.metodologia}</p>
              </div>
            )}
            {proyecto.palabras_clave && proyecto.palabras_clave.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Palabras Clave</h4>
                <div className="flex flex-wrap gap-2">
                  {proyecto.palabras_clave.map((palabra, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {palabra}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comentarios */}
        {(proyecto.comentario_asesor || proyecto.comentario_coordinador) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comentarios de Revisión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proyecto.comentario_asesor && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium mb-1">Comentario del Asesor</p>
                  <p className="text-gray-700">{proyecto.comentario_asesor}</p>
                </div>
              )}
              {proyecto.comentario_coordinador && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-medium mb-1">Comentario del Coordinador</p>
                  <p className="text-gray-700">{proyecto.comentario_coordinador}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Asesorías */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asesorías ({proyecto.asesorias?.length || 0})</CardTitle>
            <CardDescription>Registro de sesiones de asesoría</CardDescription>
          </CardHeader>
          <CardContent>
            {proyecto.asesorias?.length === 0 ? (
              <p className="text-gray-500">No hay asesorías registradas</p>
            ) : (
              <div className="space-y-2">
                {proyecto.asesorias.map((asesoria) => (
                  <div key={asesoria.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{asesoria.tipo}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        asesoria.estado === 'REALIZADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {asesoria.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(asesoria.fecha_programada).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hitos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hitos del Proyecto ({proyecto.hitos?.length || 0})</CardTitle>
            <CardDescription>Progreso y entregables</CardDescription>
          </CardHeader>
          <CardContent>
            {proyecto.hitos?.length === 0 ? (
              <p className="text-gray-500">No hay hitos definidos</p>
            ) : (
              <div className="space-y-2">
                {proyecto.hitos.map((hito) => (
                  <div key={hito.id} className="p-3 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{hito.nombre}</p>
                      {hito.descripcion && <p className="text-sm text-gray-600">{hito.descripcion}</p>}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      hito.estado === 'COMPLETADO' ? 'bg-green-100 text-green-800' : 
                      hito.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hito.estado}
                    </span>
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
