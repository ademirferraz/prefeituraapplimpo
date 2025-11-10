import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export async function pickImageFromLibrary() {
  try {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão negada para acessar suas fotos.');
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (result.canceled) return null;
    const asset = result.assets?.[0];
    return {
      uri: asset?.uri,
      name: asset?.fileName || asset?.filename || 'imagem.jpg',
      mimeType: asset?.mimeType || 'image/jpeg',
      type: 'image',
    };
  } catch (e) {
    throw e;
  }
}

export async function pickDocument() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    const asset = Array.isArray(result?.assets) && result.assets.length > 0 ? result.assets[0] : result;
    if (!asset || (asset.type && asset.type !== 'success')) return null;

    return {
      uri: asset.uri,
      name: asset.name || 'arquivo',
      mimeType: asset.mimeType || 'application/octet-stream',
      type: 'document',
    };
  } catch (e) {
    throw e;
  }
}