// 將使用者選擇的照片壓成小檔以利存入 localStorage

const DEFAULT_MAX_SIDE = 1200;
const DEFAULT_JPEG_QUALITY = 0.82;

type CompressImageOptions = {
  maxSide?: number;
  quality?: number;
};

/**
 * 讀取圖片並以 Canvas 縮放到最大邊不超過 MAX_SIDE，輸出 JPEG data URL。
 */
export function compressImageToJpegDataUrl(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const requestedMaxSide =
      typeof options.maxSide === 'number' && Number.isFinite(options.maxSide)
        ? options.maxSide
        : DEFAULT_MAX_SIDE;
    const requestedQuality =
      typeof options.quality === 'number' && Number.isFinite(options.quality)
        ? options.quality
        : DEFAULT_JPEG_QUALITY;
    const maxSide = Math.min(2400, Math.max(600, requestedMaxSide));
    const quality = Math.min(0.92, Math.max(0.65, requestedQuality));
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        let { width, height } = img;
        const scale = Math.min(1, maxSide / Math.max(width, height));
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
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
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
