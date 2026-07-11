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
import { ArrowLeft, Send, Check, X, Calendar, User, FileText, Target, BookOpen } from 'lucide-react-native';

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
  estudiante: {
    nombres: string;
    apellido_paterno: string;
  };
  asesor?: {
    nombres: string;
    apellido_paterno: string;
  };
  comentario_asesor?: string;
}

const estadoColors = {
  BORRADOR: '#E5E7EB',
  ENVIADO_ASESOR: '#DBEAFE',
  APROBADO_ASESOR: '#D1FAE5',
  RECHAZADO_ASESOR: '#FEE2E2',
  ENVIADO_COORDINADOR: '#EDE9FE',
  APROBADO_COORDINADOR: '#D1FAE5',
  RECHAZADO_COORDINADOR: '#FEE2E2',
  EN_DESARROLLO: '#FEF3C7',
  FINALIZADO: '#D1FAE5',
  CANCELADO: '#E5E7EB',
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

export default function ProjectDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { user } = useAuth();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProyecto();
  }, [id]);

  const fetchProyecto = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/proyectos/${id}`);
      setProyecto(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el proyecto');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const enviarAAesor = async () => {
    try {
      await api.post(`/proyectos/${id}/enviar-asesor`);
      Alert.alert('Éxito', 'Proyecto enviado a asesor');
      fetchProyecto();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al enviar');
    }
  };

  const aprobarProyecto = async () => {
    try {
      const endpoint = user?.rol === 'ASESOR'
        ? `/proyectos/${id}/aprobar-asesor`
        : `/proyectos/${id}/aprobar-coordinador`;
      await api.post(endpoint, {});
      Alert.alert('Éxito', 'Proyecto aprobado');
      fetchProyecto();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al aprobar');
    }
  };

  const rechazarProyecto = async () => {
    Alert.prompt(
      'Rechazar Proyecto',
      'Ingresa el motivo del rechazo:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          onPress: async (comentario) => {
            if (!comentario) return;
            try {
              const endpoint = user?.rol === 'ASESOR'
                ? `/proyectos/${id}/rechazar-asesor`
                : `/proyectos/${id}/rechazar-coordinador`;
              await api.post(endpoint, { comentario });
              Alert.alert('Éxito', 'Proyecto rechazado');
              fetchProyecto();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Error al rechazar');
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!proyecto) return null;

  const canEnviarAAesor = user?.rol === 'ESTUDIANTE' && proyecto.estado === 'BORRADOR';
  const canAprobarAsesor = user?.rol === 'ASESOR' && proyecto.estado === 'ENVIADO_ASESOR';
  const canAprobarCoordinador = user?.rol === 'COORDINADOR' && proyecto.estado === 'ENVIADO_COORDINADOR';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Proyecto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, styles.headerCard]}>
          <Text style={styles.titulo}>{proyecto.titulo}</Text>
          <View style={[styles.estadoBadge, { backgroundColor: estadoColors[proyecto.estado as keyof typeof estadoColors] }]}>
            <Text style={styles.estadoText}>{estadoLabels[proyecto.estado as keyof typeof estadoLabels]}</Text>
          </View>

          {(canEnviarAAesor || canAprobarAsesor || canAprobarCoordinador) && (
            <View style={styles.actions}>
              {canEnviarAAesor && (
                <TouchableOpacity style={styles.actionButton} onPress={enviarAAesor}>
                  <Send size={16} color="white" />
                  <Text style={styles.actionButtonText}>Enviar a Asesor</Text>
                </TouchableOpacity>
              )}
              {(canAprobarAsesor || canAprobarCoordinador) && (
                <>
                  <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={aprobarProyecto}>
                    <Check size={16} color="white" />
                    <Text style={styles.actionButtonText}>Aprobar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={rechazarProyecto}>
                    <X size={16} color="white" />
                    <Text style={styles.actionButtonText}>Rechazar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <User size={20} color="#6B7280" />
            <Text style={styles.infoLabel}>Estudiante</Text>
            <Text style={styles.infoValue}>{proyecto.estudiante.nombres} {proyecto.estudiante.apellido_paterno}</Text>
          </View>
          <View style={styles.infoCard}>
            <User size={20} color="#6B7280" />
            <Text style={styles.infoLabel}>Asesor</Text>
            <Text style={styles.infoValue}>{proyecto.asesor ? `${proyecto.asesor.nombres} ${proyecto.asesor.apellido_paterno}` : 'Sin asignar'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.cardTitle}>Fechas</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Inicio:</Text>
            <Text style={styles.dateValue}>{proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString() : 'No definido'}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Fin estimado:</Text>
            <Text style={styles.dateValue}>{proyecto.fecha_fin_estimada ? new Date(proyecto.fecha_fin_estimada).toLocaleDateString() : 'No definido'}</Text>
          </View>
        </View>

        {proyecto.descripcion && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FileText size={20} color="#6B7280" />
              <Text style={styles.cardTitle}>Descripción</Text>
            </View>
            <Text style={styles.cardText}>{proyecto.descripcion}</Text>
          </View>
        )}

        {proyecto.problema_investigacion && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Problema de Investigación</Text>
            <Text style={styles.cardText}>{proyecto.problema_investigacion}</Text>
          </View>
        )}

        {proyecto.objetivos && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Target size={20} color="#6B7280" />
              <Text style={styles.cardTitle}>Objetivos</Text>
            </View>
            <Text style={styles.cardText}>{proyecto.objetivos}</Text>
          </View>
        )}

        {proyecto.justificacion && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Justificación</Text>
            <Text style={styles.cardText}>{proyecto.justificacion}</Text>
          </View>
        )}

        {proyecto.metodologia && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <BookOpen size={20} color="#6B7280" />
              <Text style={styles.cardTitle}>Metodología</Text>
            </View>
            <Text style={styles.cardText}>{proyecto.metodologia}</Text>
          </View>
        )}

        {proyecto.palabras_clave && proyecto.palabras_clave.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Palabras Clave</Text>
            <View style={styles.keywordsContainer}>
              {proyecto.palabras_clave.map((palabra, index) => (
                <View key={index} style={styles.keyword}>
                  <Text style={styles.keywordText}>{palabra}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {proyecto.comentario_asesor && (
          <View style={[styles.card, styles.commentCard]}>
            <Text style={styles.sectionTitle}>Comentario del Asesor</Text>
            <Text style={styles.cardText}>{proyecto.comentario_asesor}</Text>
          </View>
        )}
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
    marginBottom: 16,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
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
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
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
  cardText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyword: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keywordText: {
    fontSize: 12,
    color: '#374151',
  },
  commentCard: {
    backgroundColor: '#DBEAFE',
  },
});
