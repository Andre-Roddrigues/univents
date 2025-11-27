// hooks/useQRCode.ts
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    qrcode: any;
  }
}

export function useQRCode() {
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);

  useEffect(() => {
    const loadQrCodeLibrary = () => {
      return new Promise((resolve, reject) => {
        if (window.qrcode) {
          setQrCodeLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator/qrcode.js';
        script.onload = () => {
          console.log('✅ QR Code library loaded');
          setQrCodeLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('❌ Failed to load QR Code library');
          reject(new Error('Failed to load QR Code library'));
        };
        document.head.appendChild(script);
      });
    };

    loadQrCodeLibrary().catch(console.error);
  }, []);

  const generateQRCode = (text: string): string => {
    if (!window.qrcode) {
      console.warn('QR Code library not loaded');
      return '';
    }

    try {
      const typeNumber = 0;
      const errorCorrectionLevel = 'M';
      const qr = window.qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(text);
      qr.make();
      
      const svgString = qr.createSvgTag({
        scalable: true,
        margin: 1,
        color: '#000000',
        background: '#ffffff'
      });
      
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      return '';
    }
  };

  return {
    qrCodeLoaded,
    generateQRCode
  };
}