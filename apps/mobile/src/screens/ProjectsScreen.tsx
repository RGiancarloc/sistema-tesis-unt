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
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react-native';

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

export default function ProjectsScreen({ navigation }: any) {
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
      console.error('Error al cargar proyectos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProyecto = ({ item }: { item: Proyecto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.titulo} numberOfLines={2}>{item.titulo}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: estadoColors[item.estado as keyof typeof estadoColors] }]}>
          <Text style={styles.estadoText}>{estadoLabels[item.estado as keyof typeof estadoLabels]}</Text>
        </View>
      </View>
      <Text style={styles.asesor}>
        {item.asesor
          ? `Asesor: ${item.asesor.nombres} ${item.asesor.apellido_paterno}`
          : 'Sin asesor asignado'}
      </Text>
      <View style={styles.fechaContainer}>
        <Clock size={16} color="#6B7280" />
        <Text style={styles.fechaText}>
          {item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleDateString() : 'No definido'}
        </Text>
      </View>
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
        <Text style={styles.headerTitle}>Mis Proyectos</Text>
        {user?.rol !== 'ASESOR' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('NewProject')}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Nuevo</Text>
          </TouchableOpacity>
        )}
      </View>

      {proyectos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileText size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No hay proyectos</Text>
          <Text style={styles.emptyText}>
            {user?.rol === 'ASESOR'
              ? 'No tienes proyectos asignados'
              : 'Aún no has creado ningún proyecto'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={proyectos}
          renderItem={renderProyecto}
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
    fontSize: 24,
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
  asesor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fechaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
