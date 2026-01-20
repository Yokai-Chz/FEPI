import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import infraccionesData from '../../src/data/infracciones.json';

export interface InfractionArticle {
  id: string;
  descripcion: string;
}

interface InfractionSelectorProps {
  selectedArticles: InfractionArticle[];
  onAdd: (article: InfractionArticle) => void;
  onRemove: (id: string) => void;
}

const infraccionesDict: Record<string, string> = infraccionesData;

export default function InfractionSelector({ selectedArticles, onAdd, onRemove }: InfractionSelectorProps) {
  const [busqueda, setBusqueda] = useState("");

  const handleSelect = (id: string, descripcion: string) => {
    // Evitar duplicados
    if (!selectedArticles.some(a => a.id === id)) {
      onAdd({ id, descripcion });
    }
    setBusqueda("");
  };

  // Filtrar sugerencias
  const sugerencias = busqueda.length > 1 
    ? Object.entries(infraccionesDict)
        .filter(([id, desc]) => {
          const query = busqueda.toLowerCase();
          return id.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
        })
        .slice(0, 3) 
    : [];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>MOTIVO DE INFRACCIÓN</Text>
      
      {/* Buscador siempre visible para agregar más */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Ej: ART-38 o 'celular'..."
        />
      </View>

      {/* Sugerencias */}
      {sugerencias.map(([id, desc]) => (
        <TouchableOpacity 
          key={id} 
          style={styles.suggestion} 
          onPress={() => handleSelect(id, desc)}
        >
          <Text style={styles.suggestionTitle}>{id}</Text>
          <Text style={styles.suggestionDesc}>{desc}</Text>
          <Text style={styles.suggestionSub}>TOCA PARA AGREGAR</Text>
        </TouchableOpacity>
      ))}

      {/* Lista de Artículos Seleccionados */}
      <View style={styles.listContainer}>
        {selectedArticles.map((article) => (
          <View key={article.id} style={styles.selectedArtBox}>
            <View style={styles.artContent}>
              <Text style={styles.artTitle}>{article.id}</Text>
              <Text style={styles.artDesc}>{article.descripcion}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => onRemove(article.id)}
            >
              <Trash2 size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  searchContainer: { marginBottom: 12 },
  searchInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, padding: 14, fontSize: 14 },
  
  suggestion: { marginBottom: 8, backgroundColor: '#FFF9F2', borderWidth: 2, borderStyle: 'dashed', borderColor: '#BC955C', borderRadius: 12, padding: 14 },
  suggestionTitle: { fontSize: 12, fontWeight: 'bold', color: '#691C32' },
  suggestionDesc: { fontSize: 11, color: '#1f2937', marginTop: 2 },
  suggestionSub: { fontSize: 9, color: '#BC955C', fontWeight: '900', textAlign: 'right', marginTop: 8 },
  
  listContainer: { marginTop: 8, gap: 8 },
  selectedArtBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(105,28,50,0.05)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(105,28,50,0.1)' },
  artContent: { flex: 1, paddingRight: 8 },
  artTitle: { fontSize: 13, fontWeight: 'bold', color: '#691C32', marginBottom: 2 },
  artDesc: { fontSize: 11, color: '#1f2937', lineHeight: 16 },
  deleteBtn: { padding: 8, backgroundColor: '#fee2e2', borderRadius: 8 },
});
