import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/axios';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        correo_institucional: email,
        contrasena: password,
      });

      const { access_token, refresh_token, usuario } = response.data;
      await setAuth(usuario, access_token, refresh_token);

      navigation.replace('Dashboard');
    } catch (error: any) {
      Alert.alert(
        'Error de autenticación',
        error.response?.data?.message || 'Credenciales inválidas',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema de Gestión de Tesis</Text>
      <Text style={styles.subtitle}>Universidad Nacional de Trujillo</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo institucional"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        onPress={handleLogin}
        disabled={isLoading}
      />

      {isLoading && <ActivityIndicator style={styles.loader} />}

      <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
        ¿Olvidaste tu contraseña?
      </Text>

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
});
