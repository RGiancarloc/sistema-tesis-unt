import React, { useState } from 'react';
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
import api from '@/lib/axios';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    correo_institucional: '',
    contrasena: '',
    confirmar_contrasena: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    dni: '',
    telefono: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (formData.contrasena !== formData.confirmar_contrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.contrasena.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmar_contrasena, ...registerData } = formData;
      await api.post('/auth/register', registerData);

      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Por favor inicia sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        'Error de registro',
        error.response?.data?.message || 'No se pudo crear la cuenta',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Sistema de Gestión de Tesis - UNT</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo institucional"
        value={formData.correo_institucional}
        onChangeText={(text) => setFormData({ ...formData, correo_institucional: text })}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Nombres"
        value={formData.nombres}
        onChangeText={(text) => setFormData({ ...formData, nombres: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido Paterno"
        value={formData.apellido_paterno}
        onChangeText={(text) => setFormData({ ...formData, apellido_paterno: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido Materno (opcional)"
        value={formData.apellido_materno}
        onChangeText={(text) => setFormData({ ...formData, apellido_materno: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="DNI (opcional)"
        value={formData.dni}
        onChangeText={(text) => setFormData({ ...formData, dni: text })}
        keyboardType="numeric"
        maxLength={8}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono (opcional)"
        value={formData.telefono}
        onChangeText={(text) => setFormData({ ...formData, telefono: text })}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={formData.contrasena}
        onChangeText={(text) => setFormData({ ...formData, contrasena: text })}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={formData.confirmar_contrasena}
        onChangeText={(text) => setFormData({ ...formData, confirmar_contrasena: text })}
        secureTextEntry
      />

      <Button
        title={isLoading ? 'Cargando...' : 'Registrarse'}
        onPress={handleRegister}
        disabled={isLoading}
      />

      {isLoading && <ActivityIndicator style={styles.loader} />}

      <Text style={styles.link} onPress={() => navigation.replace('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loader: {
    marginTop: 20,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
});
