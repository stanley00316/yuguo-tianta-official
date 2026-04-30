// 將使用者選擇的照片壓成小檔以利存入 localStorage

const MAX_SIDE = 1200;
const JPEG_QUALITY = 0.82;

/**
 * 讀取圖片並以 Canvas 縮放到最大邊不超過 MAX_SIDE，輸出 JPEG data URL。
 */
export function compressImageToJpegDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        let { width, height } = img;
        const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('無法建立畫布'));
          return;
        }
        // 將圖繪製到縮放後的尺寸
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve(dataUrl);
      } catch (e) {
        reject(e instanceof Error ? e : new Error('壓縮失敗'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('無法讀取此圖片檔案'));
    };

    img.src = url;
  });
}
