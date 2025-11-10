import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function GravarMidiaScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [type, setType] = useState(
    Platform.OS === 'web' ? 'back' : Camera.Constants.Type.back
  );
  const cameraRef = useRef(null);
  const [capturedMedia, setCapturedMedia] = useState(null);

  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===
  useFocusEffect(
    useCallback(() => {
      return () => {
        setHasPermission(""); setCapturedMedia("");
      };
    }, [])
  );


  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setHasPermission(true);
      } else {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  const handleSimulatedCapture = () => {
    setCapturedMedia({
      uri: 'https://via.placeholder.com/300x200.png?text=Mídia+Simulada',
    });
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setCapturedMedia({ uri: result.assets[0].uri });
    }
  };

  const handleEnviar = () => {
    Alert.alert('Mídia enviada!', 'Sua imagem foi enviada com sucesso para a prefeitura.');
    setCapturedMedia(null);
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false)
    return <Text>Permissão para usar a câmera não foi concedida.</Text>;

  return (
    <View style={styles.container}>
      {cameraVisible && Platform.OS !== 'web' ? (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Text style={styles.flipText}>Inverter</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      ) : (
        <View style={styles.webCameraPlaceholder}>
          <Button title="Simular Captura de Imagem" onPress={handleSimulatedCapture} />
          <Button title="Selecionar Imagem do Dispositivo" onPress={handleImagePicker} />
        </View>
      )}

      {capturedMedia && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedMedia.uri }} style={styles.previewImage} />
          <Text style={styles.previewLabel}>Prévia da Mídia</Text>
          <Button title="Enviar para o Prefeito" onPress={handleEnviar} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  flipText: {
    color: '#fff',
    fontSize: 16,
  },
  webCameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
  },
  previewLabel: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});