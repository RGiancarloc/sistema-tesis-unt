import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { ArrowLeft, Send, Check, X, Upload, FileText, Calendar, Clock } from 'lucide-react-native';

interface Informe {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  numero_version: number;
  fecha_inicio: string;
  fecha_limite: string;
  fecha_entrega: string;
  comentario_asesor: string;
  versiones: any[];
  revisiones: any[];
}

const estadoColors = {
  BORRADOR: '#E5E7EB',
  EN_REVISION: '#DBEAFE',
  APROBADO: '#D1FAE5',
  RECHAZADO: '#FEE2E2',
  FINALIZADO: '#D1FAE5',
  ENTREGADO: '#EDE9FE',
};

const estadoLabels = {
  BORRADOR: 'Borrador',
  EN_REVISION: 'En Revisión',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  FINALIZADO: 'Finalizado',
  ENTREGADO: 'Entregado',
};

export default function ReportDetailScreen({ route, navigation }: any) {
  const { proyectoId, informeId } = route.params;
  const { user } = useAuth();
  const [informe, setInforme] = useState<Informe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInforme();
  }, [informeId]);

  const fetchInforme = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/informes/${informeId}`);
      setInforme(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el informe');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const enviarRevision = async () => {
    try {
      await api.post(`/informes/${informeId}/enviar-revision`);
      Alert.alert('Éxito', 'Informe enviado a revisión');
      fetchInforme();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al enviar');
    }
  };

  const aprobarInforme = async () => {
    try {
      await api.post(`/informes/${informeId}/aprobar`);
      Alert.alert('Éxito', 'Informe aprobado');
      fetchInforme();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al aprobar');
    }
  };

  const rechazarInforme = async () => {
    Alert.prompt(
      'Rechazar Informe',
      'Ingresa el motivo del rechazo:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          onPress: async (comentario) => {
            if (!comentario) return;
            try {
              await api.post(`/informes/${informeId}/rechazar`, { comentario });
              Alert.alert('Éxito', 'Informe rechazado');
              fetchInforme();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Error al rechazar');
            }
          },
        },
      ],
    );
  };

  const finalizarInforme = async () => {
    try {
      await api.post(`/informes/${informeId}/finalizar`);
      Alert.alert('Éxito', 'Informe finalizado');
      fetchInforme();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al finalizar');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!informe) return null;

  const canEnviarRevision = user?.rol === 'ESTUDIANTE' && informe.estado === 'BORRADOR';
  const canAprobar = user?.rol === 'ASESOR' && informe.estado === 'EN_REVISION';
  const canFinalizar = (user?.rol === 'COORDINADOR' || user?.rol === 'ESTUDIANTE') && informe.estado === 'APROBADO';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Informe</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, styles.headerCard]}>
          <Text style={styles.titulo}>{informe.titulo}</Text>
          <View style={[styles.estadoBadge, { backgroundColor: estadoColors[informe.estado as keyof typeof estadoColors] }]}>
            <Text style={styles.estadoText}>{estadoLabels[informe.estado as keyof typeof estadoLabels]}</Text>
          </View>
          <Text style={styles.version}>Versión {informe.numero_version}</Text>

          {(canEnviarRevision || canAprobar || canFinalizar) && (
            <View style={styles.actions}>
              {canEnviarRevision && (
                <TouchableOpacity style={styles.actionButton} onPress={enviarRevision}>
                  <Send size={16} color="white" />
                  <Text style={styles.actionButtonText}>Enviar a Revisión</Text>
                </TouchableOpacity>
              )}
              {canAprobar && (
                <>
                  <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={aprobarInforme}>
                    <Check size={16} color="white" />
                    <Text style={styles.actionButtonText}>Aprobar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={rechazarInforme}>
                    <X size={16} color="white" />
                    <Text style={styles.actionButtonText}>Rechazar</Text>
                  </TouchableOpacity>
                </>
              )}
              {canFinalizar && (
                <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={finalizarInforme}>
                  <Check size={16} color="white" />
                  <Text style={styles.actionButtonText}>Finalizar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {informe.descripcion && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.cardText}>{informe.descripcion}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.cardTitle}>Fechas</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Inicio:</Text>
            <Text style={styles.dateValue}>{informe.fecha_inicio ? new Date(informe.fecha_inicio).toLocaleDateString() : 'No definido'}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Límite:</Text>
            <Text style={styles.dateValue}>{informe.fecha_limite ? new Date(informe.fecha_limite).toLocaleDateString() : 'No definido'}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Entrega:</Text>
            <Text style={styles.dateValue}>{informe.fecha_entrega ? new Date(informe.fecha_entrega).toLocaleDateString() : 'No entregado'}</Text>
          </View>
        </View>

        {informe.comentario_asesor && (
          <View style={[styles.card, styles.commentCard]}>
            <Text style={styles.sectionTitle}>Comentario del Asesor</Text>
            <Text style={styles.cardText}>{informe.comentario_asesor}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FileText size={20} color="#6B7280" />
            <Text style={styles.cardTitle}>Versiones ({informe.versiones?.length || 0})</Text>
          </View>
          {informe.versiones?.length === 0 ? (
            <Text style={styles.emptyText}>No hay versiones cargadas</Text>
          ) : (
            informe.versiones.map((version) => (
              <View key={version.id} style={styles.versionItem}>
                <Text style={styles.versionName}>{version.nombre_archivo}</Text>
                <Text style={styles.versionInfo}>
                  Versión {version.numero_version} • {(version.tamano_bytes / 1024 / 1024).toFixed(2)} MB
                </Text>
              </View>
            ))
          )}
          {user?.rol === 'ESTUDIANTE' && (
            <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.navigate('UploadVersion', { proyectoId, informeId })}>
              <Upload size={16} color="white" />
              <Text style={styles.uploadButtonText}>Subir Nueva Versión</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={20} color="#6B7280" />
            <Text style={styles.cardTitle}>Revisiones ({informe.revisiones?.length || 0})</Text>
          </View>
          {informe.revisiones?.length === 0 ? (
            <Text style={styles.emptyText}>No hay revisiones registradas</Text>
          ) : (
            informe.revisiones.map((revision) => (
              <View key={revision.id} style={styles.revisionItem}>
                <View style={styles.revisionHeader}>
                  <Text style={styles.revisorName}>
                    {revision.revisor?.nombres} {revision.revisor?.apellido_paterno}
                  </Text>
                  <View style={[styles.revisionBadge, {
                    backgroundColor: revision.estado === 'APROBADA' ? '#D1FAE5' :
                    revision.estado === 'RECHAZADA' ? '#FEE2E2' : '#DBEAFE'
                  }]}>
                    <Text style={styles.revisionState}>{revision.estado}</Text>
                  </View>
                </View>
                {revision.comentarios && <Text style={styles.revisionComment}>{revision.comentarios}</Text>}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCard: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  version: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentCard: {
    backgroundColor: '#DBEAFE',
  },
  versionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  versionName: {
    fontSize: 14,
    fontWeight: '600',
  },
  versionInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  revisionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  revisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  revisorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  revisionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  revisionState: {
    fontSize: 10,
    fontWeight: '600',
  },
  revisionComment: {
    fontSize: 13,
    color: '#374151',
    marginTop: 4,
  },
});
