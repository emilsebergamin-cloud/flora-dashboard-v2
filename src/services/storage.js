import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase.js';
import { v4 as uuid } from 'uuid';

// Comprime una imagen client-side: max 1200px de ancho, calidad 80%
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_WIDTH = 1200;
      const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        0.8,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
}

// Sube una imagen comprimida a Firebase Storage y devuelve la URL pública
// path: e.g. "content/abc123" → se sube como "images/content/abc123/{uuid}.jpg"
export async function uploadImage(file, path) {
  const blob = await compressImage(file);
  const storageRef = ref(storage, `images/${path}/${uuid()}.jpg`);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}

// Borra una imagen de Storage dado su URL público
export async function deleteImage(url) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err) {
    // Si el archivo ya no existe, no es error crítico
    if (err.code !== 'storage/object-not-found') throw err;
  }
}
