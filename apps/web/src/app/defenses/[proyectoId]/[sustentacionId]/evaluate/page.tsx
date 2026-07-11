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
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

interface RubricaItem {
  criterio: string;
  peso: number;
  calificacion: number;
}

export default function EvaluateDefensePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [rubrica, setRubrica] = useState<RubricaItem[]>([
    { criterio: 'Claridad en la exposición', peso: 20, calificacion: 0 },
    { criterio: 'Dominio del tema', peso: 25, calificacion: 0 },
    { criterio: 'Calidad de las respuestas', peso: 25, calificacion: 0 },
    { criterio: 'Uso de recursos visuales', peso: 15, calificacion: 0 },
    { criterio: 'Tiempo y organización', peso: 15, calificacion: 0 },
  ]);
  const [formData, setFormData] = useState({
    fortalezas: '',
    debilidades: '',
    recomendaciones: '',
    comentarios_generales: '',
  });

  useEffect(() => {
    // Cargar datos de la sustentación si es necesario
  }, [params.sustentacionId]);

  const handleCalificacionChange = (index: number, value: number) => {
    const newRubrica = [...rubrica];
    newRubrica[index].calificacion = Math.min(20, Math.max(0, value));
    setRubrica(newRubrica);
  };

  const calcularTotal = () => {
    return rubrica.reduce((total, item) => {
      return total + (item.calificacion * item.peso / 20);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const calificacionTotal = calcularTotal();
    if (calificacionTotal === 0) {
      toast.error('Debes asignar calificaciones a todos los criterios');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        sustentacion_id: params.sustentacionId,
        jurado_id: user?.id,
        calificacion_total: calificacionTotal,
        rubrica_evaluacion: rubrica,
        ...formData,
        aprobado: calificacionTotal >= 70,
      };

      await api.post('/sustentaciones/evaluaciones', payload);
      await api.post(`/sustentaciones/evaluaciones/${params.sustentacionId}/completar`, {
        calificacionTotal,
        rubrica: rubrica,
        comentarios: formData.comentarios_generales,
      });

      toast.success('Evaluación completada exitosamente');
      router.back();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al completar evaluación');
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
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Evaluación de Sustentación
          </CardTitle>
          <CardDescription>Completa la rúbrica de evaluación</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rúbrica de Evaluación</h3>
              {rubrica.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="font-medium">{item.criterio}</Label>
                    <span className="text-sm text-gray-600">Peso: {item.peso}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min="0"
                      max="20"
                      value={item.calificacion}
                      onChange={(e) => handleCalificacionChange(index, parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      value={item.calificacion}
                      onChange={(e) => handleCalificacionChange(index, parseInt(e.target.value))}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-gray-600 w-24">
                      {(item.calificacion * item.peso / 20).toFixed(1)} pts
                    </span>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="font-semibold">Calificación Total:</span>
                <span className="text-2xl font-bold">{calcularTotal().toFixed(1)} / 100</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comentarios Detallados</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fortalezas">Fortalezas</Label>
                <textarea
                  id="fortalezas"
                  value={formData.fortalezas}
                  onChange={(e) => setFormData({ ...formData, fortalezas: e.target.value })}
                  placeholder="Describe las fortalezas de la sustentación"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="debilidades">Áreas de Mejora</Label>
                <textarea
                  id="debilidades"
                  value={formData.debilidades}
                  onChange={(e) => setFormData({ ...formData, debilidades: e.target.value })}
                  placeholder="Describe las áreas que necesitan mejora"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recomendaciones">Recomendaciones</Label>
                <textarea
                  id="recomendaciones"
                  value={formData.recomendaciones}
                  onChange={(e) => setFormData({ ...formData, recomendaciones: e.target.value })}
                  placeholder="Proporciona recomendaciones para el estudiante"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentarios">Comentarios Generales</Label>
                <textarea
                  id="comentarios"
                  value={formData.comentarios_generales}
                  onChange={(e) => setFormData({ ...formData, comentarios_generales: e.target.value })}
                  placeholder="Comentarios adicionales sobre la sustentación"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Guardando...' : 'Completar Evaluación'}
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
