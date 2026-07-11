'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Upload, FileText } from 'lucide-react';

export default function UploadVersionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    notas_version: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Debes seleccionar un archivo');
      return;
    }

    setIsLoading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('informe_id', params.informeId as string);
      formDataUpload.append('notas_version', formData.notas_version);

      // Obtener el número de versión actual
      const informeResponse = await api.get(`/informes/${params.informeId}`);
      const currentVersion = informeResponse.data.numero_version || 0;

      // Simular subida (en producción esto iría a MinIO/S3)
      const payload = {
        informe_id: params.informeId,
        numero_version: currentVersion + 1,
        nombre_archivo: file.name,
        ruta_archivo: `/uploads/${params.informeId}/${file.name}`,
        url_archivo: `http://localhost:9000/sistema-tesis-unt/${params.informeId}/${file.name}`,
        tamano_bytes: file.size,
        tipo_archivo: file.name.endsWith('.pdf') ? 'PDF' : 'OTRO',
        notas_version: formData.notas_version,
      };

      await api.post('/informes/versiones', payload);
      toast.success('Versión subida exitosamente');
      router.back();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al subir versión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Subir Nueva Versión
          </CardTitle>
          <CardDescription>Sube una nueva versión del informe de tesis</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">Archivo *</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX (MAX. 10MB)</p>
                  </div>
                  <Input id="file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.doc" />
                </label>
              </div>
              {file && (
                <div className="flex items-center mt-2 p-2 bg-gray-50 rounded">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas de la Versión</Label>
              <textarea
                id="notas"
                value={formData.notas_version}
                onChange={(e) => setFormData({ ...formData, notas_version: e.target.value })}
                placeholder="Describe los cambios realizados en esta versión"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading || !file}>
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? 'Subiendo...' : 'Subir Versión'}
              </Button>
              <Button type="button" variant="outline" onClick>(() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
