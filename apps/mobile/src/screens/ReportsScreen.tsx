import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Plus, FileText, Calendar, CheckCircle } from 'lucide-react-native';

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

export default function ReportsScreen({ route, navigation }: any) {
  const { proyectoId } = route.params;
  const { user } = useAuth();
  const [informes, setInformes] = useState<Informe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInformes();
  }, [proyectoId]);

  const fetchInformes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/informes/proyecto/${proyectoId}`);
      setInformes(response.data);
    } catch (error) {
      console.error('Error al cargar informes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInforme = ({ item }: { item: Informe }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ReportDetail', { proyectoId, informeId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.titulo} numberOfLines={2}>{item.titulo}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: estadoColors[item.estado as keyof typeof estadoColors] }]}>
          <Text style={styles.estadoText}>{estadoLabels[item.estado as keyof typeof estadoLabels]}</Text>
        </View>
      </View>
      <Text style={styles.version}>Versión {item.numero_version}</Text>
      <View style={styles.dateRow}>
        <Calendar size={16} color="#6B7280" />
        <Text style={styles.dateText}>
          {item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleDateString() : 'No definido'}
        </Text>
      </View>
      {item.fecha_entrega && (
        <View style={styles.dateRow}>
          <CheckCircle size={16} color="#10B981" />
          <Text style={[styles.dateText, styles.deliveredText]}>
            Entregado: {new Date(item.fecha_entrega).toLocaleDateString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
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
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informes</Text>
        {user?.rol === 'ESTUDIANTE' && (
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('NewReport', { proyectoId })}>
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Nuevo</Text>
          </TouchableOpacity>
        )}
      </View>

      {informes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileText size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No hay informes</Text>
          <Text style={styles.emptyText}>Aún no has creado ningún informe</Text>
        </View>
      ) : (
        <FlatList
          data={informes}
          renderItem={renderInforme}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  deliveredText: {
    color: '#10B981',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
