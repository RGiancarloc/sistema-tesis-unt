import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const menuItems = [
    {
      title: 'Mi Perfil',
      description: 'Gestiona tu información personal',
      icon: '👤',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      title: 'Mis Tesis',
      description: 'Ver y gestionar tus tesis',
      icon: '📚',
      onPress: () => {},
    },
    {
      title: 'Informes',
      description: 'Ver informes de asesoría',
      icon: '📄',
      onPress: () => {},
    },
    {
      title: 'Configuración',
      description: 'Ajustes de la cuenta',
      icon: '⚙️',
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Gestión de Tesis</Text>
        <Text style={styles.headerSubtitle}>UNT</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.welcome}>Bienvenido, {user?.nombres}</Text>
        <Text style={styles.role}>Rol: {user?.rol || 'Estudiante'}</Text>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Estado del Sistema</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Estado</Text>
            <Text style={styles.statusValue}>Activo</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Versión</Text>
            <Text style={styles.statusValue}>1.0.0</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Último acceso</Text>
            <Text style={styles.statusValue}>Hoy</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    margin: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusLabel: {
    color: '#666',
  },
  statusValue: {
    fontWeight: '600',
  },
});
