import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombres: user.nombres || '',
        apellido_paterno: user.apellido_paterno || '',
        apellido_materno: user.apellido_materno || '',
        telefono: user.telefono || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/usuarios/me', formData);
      Alert.alert('Éxito', 'Perfil actualizado');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo actualizar el perfil',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Button title="Volver" onPress={() => navigation.goBack()} />

      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.subtitle}>Actualiza tu información personal</Text>

      <Text style={styles.label}>Correo Institucional</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={user?.correo_institucional || ''}
        editable={false}
      />

      <Text style={styles.label}>Nombres</Text>
      <TextInput
        style={styles.input}
        value={formData.nombres}
        onChangeText={(text) => setFormData({ ...formData, nombres: text })}
      />

      <Text style={styles.label}>Apellido Paterno</Text>
      <TextInput
        style={styles.input}
        value={formData.apellido_paterno}
        onChangeText={(text) => setFormData({ ...formData, apellido_paterno: text })}
      />

      <Text style={styles.label}>Apellido Materno</Text>
      <TextInput
        style={styles.input}
        value={formData.apellido_materno}
        onChangeText={(text) => setFormData({ ...formData, apellido_materno: text })}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={formData.telefono}
        onChangeText={(text) => setFormData({ ...formData, telefono: text })}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Rol</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={user?.rol || ''}
        editable={false}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isSaving ? 'Guardando...' : 'Guardar Cambios'}
          onPress={handleSave}
          disabled={isSaving}
        />
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          color="#FF3B30"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 10,
  },
});
