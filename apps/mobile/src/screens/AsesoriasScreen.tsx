import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { ArrowLeft, Plus, Calendar, Clock, CheckCircle } from 'lucide-react-native';

interface Asesoria {
  id: string;
  tipo: string;
  fecha_programada: string;
  fecha_realizada?: string;
  estado: string;
  descripcion?: string;
  conclusiones?: string;
}

const tipoColors = {
  PLANIFICACION: '#DBEAFE',
  MARCO_TEORICO: '#EDE9FE',
  METODOLOGIA: '#D1FAE5',
  RESULTADOS: '#FEF3C7',
  REDACCION: '#FED7AA',
  GENERAL: '#E5E7EB',
};

const estadoColors = {
  PROGRAMADA: '#DBEAFE',
  REALIZADA: '#D1FAE5',
  CANCELADA: '#FEE2E2',
  REPROGRAMADA: '#FEF3C7',
};

export default function AsesoriasScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { user } = useAuth();
  const [asesorias, setAsesorias] = useState<Asesoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'GENERAL',
    fecha_programada: '',
    descripcion: '',
  });

  useEffect(() => {
    fetchAsesorias();
  }, [id]);

  const fetchAsesorias = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/proyectos/asesorias/proyecto/${id}`);
      setAsesorias(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las asesorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fecha_programada) {
      Alert.alert('Error', 'La fecha es obligatoria');
      return;
    }

    try {
      const payload = {
        ...formData,
        proyecto_id: id,
        asesor_id: user?.id,
        fecha_programada: new Date(formData.fecha_programada).toISOString(),
      };

      await api.post('/proyectos/asesorias', payload);
      Alert.alert('Éxito', 'Asesoría programada');
      setShowForm(false);
      setFormData({ tipo: 'GENERAL', fecha_programada: '', descripcion: '' });
      fetchAsesorias();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear asesoría');
    }
  };

  const completarAsesoria = async (asesoriaId: string) => {
    Alert.prompt(
      'Completar Asesoría',
      'Ingresa las conclusiones:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          onPress: async (conclusiones) => {
            if (!conclusiones) return;
            try {
              await api.post(`/proyectos/asesorias/${asesoriaId}/completar`, { conclusiones });
              Alert.alert('Éxito', 'Asesoría completada');
              fetchAsesorias();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Error al completar');
            }
          },
        },
      ],
    );
  };

  const renderAsesoria = ({ item }: { item: Asesoria }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.tipoBadge, { backgroundColor: tipoColors[item.tipo as keyof typeof tipoColors] }]}>
          <Text style={styles.tipoText}>{item.tipo}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: estadoColors[item.estado as keyof typeof estadoColors] }]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>
      <View style={styles.dateRow}>
        <Clock size={16} color="#6B7280" />
        <Text style={styles.dateText}>{new Date(item.fecha_programada).toLocaleString()}</Text>
      </View>
      {item.fecha_realizada && (
        <View style={styles.dateRow}>
          <CheckCircle size={16} color="#10B981" />
          <Text style={[styles.dateText, styles.realizedText]}>
            Realizada: {new Date(item.fecha_realizada).toLocaleString()}
          </Text>
        </View>
      )}
      {item.descripcion && <Text style={styles.descripcion}>{item.descripcion}</Text>}
      {item.conclusiones && (
        <View style={styles.conclusions}>
          <Text style={styles.conclusionsLabel}>Conclusiones:</Text>
          <Text style={styles.conclusionsText}>{item.conclusiones}</Text>
        </View>
      )}
      {item.estado === 'PROGRAMADA' && user?.rol === 'ASESOR' && (
        <TouchableOpacity style={styles.completeButton} onPress={() => completarAsesoria(item.id)}>
          <Text style={styles.completeButtonText}>Completar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asesorías</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Plus size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Nueva Asesoría</Text>
          <Text style={styles.label}>Tipo</Text>
          <TextInput
            style={styles.input}
            value={formData.tipo}
            onChangeText={(text) => setFormData({ ...formData, tipo: text })}
          />
          <Text style={styles.label}>Fecha y Hora *</Text>
          <TextInput
            style={styles.input}
            value={formData.fecha_programada}
            onChangeText={(text) => setFormData({ ...formData, fecha_programada: text })}
            placeholder="YYYY-MM-DD HH:MM"
          />
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Temas a tratar"
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Programar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={asesorias}
        renderItem={renderAsesoria}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No hay asesorías programadas</Text>
          </View>
        }
      />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tipoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  realizedText: {
    color: '#10B981',
  },
  descripcion: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  conclusions: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  conclusionsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  conclusionsText: {
    fontSize: 13,
    color: '#065F46',
  },
  completeButton: {
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
});
