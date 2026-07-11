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
import api from '@/lib/axios';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', {
        correo_institucional: email,
      });
      setIsSuccess(true);
      Alert.alert('Correo enviado', 'Revisa tu correo para continuar');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo enviar el correo',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSuccess ? 'Correo Enviado' : 'Recuperar Contraseña'}
      </Text>
      <Text style={styles.subtitle}>
        {isSuccess
          ? 'Revisa tu correo para continuar'
          : 'Ingresa tu correo para recuperar tu contraseña'}
      </Text>

      {!isSuccess ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Correo institucional"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Button
            title={isLoading ? 'Cargando...' : 'Enviar Correo'}
            onPress={handleSubmit}
            disabled={isLoading}
          />

          {isLoading && <ActivityIndicator style={styles.loader} />}
        </>
      ) : (
        <Button
          title="Enviar otro correo"
          onPress={() => setIsSuccess(false)}
        />
      )}

      <Text style={styles.link} onPress={() => navigation.replace('Login')}>
        Volver al login
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
