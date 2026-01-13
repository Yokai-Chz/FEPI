import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Zap, Check, Trash2, Camera, X } from 'lucide-react-native';

export default function EvidenceCaptureView() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  
  const [flashOn, setFlashOn] = useState(false);
  const [fotos, setFotos] = useState<any>({
    placa: null,
    infraccion: null,
    frente: null,
    posterior: null
  });
  const [seleccion, setSeleccion] = useState('placa');

  const categorias = [
    { id: 'placa', label: 'Placa' },
    { id: 'infraccion', label: 'Motivo' },
    { id: 'frente', label: 'Frente' },
    { id: 'posterior', label: 'Trasera' }
  ];

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>DAR PERMISO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef.current && !fotos[seleccion]) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      
      setFotos((prev: any) => ({ ...prev, [seleccion]: photo.uri }));
      
      // Saltar a la siguiente categoría vacía
      const siguiente = categorias.find(c => !fotos[c.id] && c.id !== seleccion);
      if (siguiente) setSeleccion(siguiente.id);
    }
  };

  const borrarFoto = (id: string) => setFotos((prev: any) => ({ ...prev, [id]: null }));
  const totalFotos = Object.values(fotos).filter(f => f !== null).length;

  const finalizarCaptura = () => {
    if (totalFotos === 4) {
      // Aquí guardar las fotos
      router.back();
    } else {
      Alert.alert("Incompleto", "El reglamento exige las 4 fotografías.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Image source={require('../../assets/images/logo_gobierno.png')} style={styles.logo} />
          </View>
          <Text style={styles.headerTitle}>EVIDENCIA ({totalFotos}/4)</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={28} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

      {/* Visor de Cámara o Preview */}
      <View style={styles.cameraContainer}>
        {fotos[seleccion] ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: fotos[seleccion] }} style={styles.fullImage} />
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => borrarFoto(seleccion)}>
                <Trash2 size={24} color="white" />
                <Text style={styles.deleteText}>BORRAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView 
            style={styles.camera} 
            facing="back" 
            enableTorch={flashOn}
            ref={cameraRef}
          >
            {/* Guías de Encuadre */}
            <View style={styles.guides}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            
            <View style={styles.labelBadge}>
              <Text style={styles.labelText}>CAPTURING: {seleccion.toUpperCase()}</Text>
            </View>
          </CameraView>
        )}
      </View>

      {/* Selector de Categorías */}
      <View style={styles.selectorContainer}>
        <View style={styles.row}>
          {categorias.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              onPress={() => setSeleccion(cat.id)}
              style={[
                styles.catCard, 
                seleccion === cat.id && styles.catCardActive
              ]}
            >
              {fotos[cat.id] ? (
                <View style={styles.thumbWrapper}>
                  <Image source={{ uri: fotos[cat.id] }} style={styles.thumb} />
                  <View style={styles.checkOverlay}><Check size={14} color="white" /></View>
                </View>
              ) : (
                <View style={styles.catContent}>
                  <Camera size={16} color="white" />
                  <Text style={styles.catLabel}>{cat.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Controles Inferiores */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setFlashOn(!flashOn)}>
          <Zap size={28} color={flashOn ? "#fbbf24" : "#4b5563"} fill={flashOn ? "#fbbf24" : "none"} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.shutter, fotos[seleccion] && styles.shutterDisabled]} 
          onPress={tomarFoto}
          disabled={!!fotos[seleccion]}
        >
          <View style={[styles.shutterInner, fotos[seleccion] && styles.shutterInnerDisabled]} />
        </TouchableOpacity>

        <TouchableOpacity onPress={finalizarCaptura} style={styles.doneBtn}>
          <View style={[styles.doneIcon, totalFotos === 4 && styles.doneIconActive]}>
            <Check size={20} color={totalFotos === 4 ? "#BC955C" : "#4b5563"} />
          </View>
          <Text style={[styles.doneText, totalFotos === 4 && styles.doneTextActive]}>LISTO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#691C32', padding: 20 },
  text: { color: 'white', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  permButton: { backgroundColor: '#BC955C', padding: 15, borderRadius: 12 },
  permButtonText: { color: 'white', fontWeight: '900' },
  
  header: { backgroundColor: '#691C32', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 28, height: 28, resizeMode: 'contain' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 10, letterSpacing: 1 },

  cameraContainer: { flex: 1, backgroundColor: '#18181b' },
  camera: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  previewContainer: { flex: 1 },
  fullImage: { flex: 1, resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { backgroundColor: '#dc2626', padding: 20, borderRadius: 50, alignItems: 'center' },
  deleteText: { color: 'white', fontSize: 8, fontWeight: 'bold', marginTop: 4 },

  guides: { width: '70%', height: '50%', position: 'relative' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#BC955C', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  labelBadge: { position: 'absolute', top: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  labelText: { color: 'white', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },

  selectorContainer: { backgroundColor: '#18181b', padding: 15 },
  row: { flexDirection: 'row', gap: 10 },
  catCard: { flex: 1, aspectRatio: 1, borderRadius: 12, borderWidth: 2, borderColor: '#3f3f46', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  catCardActive: { borderColor: '#BC955C', backgroundColor: 'rgba(188,149,92,0.1)' },
  catContent: { alignItems: 'center', gap: 4 },
  catLabel: { color: 'white', fontSize: 7, fontWeight: 'bold' },
  thumbWrapper: { width: '100%', height: '100%' },
  thumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  checkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(105,28,80,0.4)', justifyContent: 'center', alignItems: 'center' },

  controls: { padding: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shutter: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'white' },
  shutterDisabled: { borderColor: '#27272a' },
  shutterInnerDisabled: { backgroundColor: '#27272a' },
  
  doneBtn: { alignItems: 'center', gap: 4 },
  doneIcon: { padding: 10, borderRadius: 20, borderWidth: 2, borderColor: '#27272a' },
  doneIconActive: { borderColor: '#BC955C' },
  doneText: { fontSize: 8, color: '#4b5563', fontWeight: 'bold' },
  doneTextActive: { color: '#BC955C' }
});