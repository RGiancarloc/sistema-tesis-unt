import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { ArrowLeft, Save } from 'lucide-react-native';

export default function NewProjectScreen({ navigation }: any) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    problema_investigacion: '',
    objetivos: '',
    justificacion: '',
    metodologia: '',
    palabras_clave: '',
    fecha_fin_estimada: '',
  });

  const handleSubmit = async () => {
    if (!formData.titulo) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        estudiante_id: user?.id,
        palabras_clave: formData.palabras_clave.split(',').map(p => p.trim()).filter(p => p),
        fecha_fin_estimada: formData.fecha_fin_estimada ? new Date(formData.fecha_fin_estimada) : undefined,
      };

      const response = await api.post('/proyectos', payload);
      Alert.alert('Éxito', 'Proyecto creado exitosamente', [
        { text: 'OK', onPress: () => navigation.navigate('ProjectDetail', { id: response.data.id }) },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al crear el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Proyecto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Título del Proyecto *</Text>
          <TextInput
            style={styles.input}
            value={formData.titulo}
            onChangeText={(text) => setFormData({ ...formData, titulo: text })}
            placeholder="Ej: Desarrollo de un sistema de gestión"
          />

          <Text style={styles.label}>Descripción General</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Descripción breve del proyecto"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Problema de Investigación</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.problema_investigacion}
            onChangeText={(text) => setFormData({ ...formData, problema_investigacion: text })}
            placeholder="Describe el problema que abordará tu investigación"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Objetivos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.objetivos}
            onChangeText={(text) => setFormData({ ...formData, objetivos: text })}
            placeholder="Objetivo general y específicos"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Justificación</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.justificacion}
            onChangeText={(text) => setFormData({ ...formData, justificacion: text })}
            placeholder="¿Por qué es importante esta investigación?"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Metodología</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.metodologia}
            onChangeText={(text) => setFormData({ ...formData, metodologia: text })}
            placeholder="Describe la metodología que utilizarás"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Palabras Clave</Text>
          <TextInput
            style={styles.input}
            value={formData.palabras_clave}
            onChangeText={(text) => setFormData({ ...formData, palabras_clave: text })}
            placeholder="Separadas por comas"
          />

          <Text style={styles.label}>Fecha de Finalización Estimada</Text>
          <TextInput
            style={styles.input}
            value={formData.fecha_fin_estimada}
            onChangeText={(text) => setFormData({ ...formData, fecha_fin_estimada: text })}
            placeholder="YYYY-MM-DD"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Save size={20} color="white" />
                <Text style={styles.buttonText}>Guardar Proyecto</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Cancelar</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#374151',
  },
  input: {
    backgroundColor: 'white',
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
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 12,
  },
  buttonOutlineText: {
    color: '#007AFF',
  },
});
