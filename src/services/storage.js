// ── MODO DEMO ──────────────────────────────────────────────────────────────
// Sin Firebase Storage: las imágenes se comprimen y se guardan como data URL
// (base64) dentro del propio dashboard en localStorage. Suficiente para una demo.

// Comprime una imagen client-side y devuelve un data URL JPEG (max 1000px, calidad 75%)
function compressToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_WIDTH = 1000;
      const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
}

// path se mantiene en la firma por compatibilidad, pero no se usa en modo demo.
export async function uploadImage(file, _path) {
  return compressToDataUrl(file);
}

// En modo demo no hay nada que borrar del servidor: no-op.
export async function deleteImage(_url) {
  return;
}
