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

  // Função para gerar QR code com dados mínimos e barras grossas
  const generateSimpleQRCode = (ticketCode: string, eventId: string): string => {
    if (!window.qrcode) {
      console.warn('QR Code library not loaded');
      return '';
    }

    try {
      // Dados simplificados - apenas o essencial
      // Formato: ticketCode|eventId (ex: "T12345|EVT789")
      const simpleData = `${ticketCode}|${eventId}`;
      
      // Forçar versão baixa para ter menos módulos (barras)
      // Versão 2 = 25x25 módulos (mais grosso)
      // Versão 3 = 29x29 módulos
      // Versão 4 = 33x33 módulos
      const typeNumber = 2; // Número baixo = menos módulos = barras mais grossas
      
      // Nível de correção baixo = menos módulos de correção = mais espaço para dados principais
      const errorCorrectionLevel = 'L'; // L = ~7% de correção
      
      const qr = window.qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(simpleData);
      qr.make();

      // Criar SVG com configurações para barras mais grossas
      // Aumentar o tamanho da célula (module size) para barras mais grossas
      const cellSize = 8; // Tamanho de cada módulo em pixels (maior = mais grosso)
      const margin = 2; // Margem em módulos
      
      const svgString = qr.createSvgTag({
        scalable: false, // Não escalável para manter tamanho fixo
        margin: margin,
        color: '#000000',
        background: '#ffffff',
        // Forçar tamanho fixo para garantir barras grossas
        width: (qr.getModuleCount() + margin * 2) * cellSize,
        height: (qr.getModuleCount() + margin * 2) * cellSize
      });

      // Modificar o SVG para usar retângulos maiores
      // A biblioteca original pode não suportar cellSize, então vamos manipular o SVG
      let enhancedSvg = svgString;
      
      // Se a biblioteca não suportar cellSize, vamos modificar o viewBox
      if (!enhancedSvg.includes('width=')) {
        const moduleCount = qr.getModuleCount();
        const totalSize = (moduleCount + margin * 2) * cellSize;
        
        // Criar SVG manualmente para ter controle total
        enhancedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">`;
        
        // Adicionar fundo branco
        enhancedSvg += `<rect width="${totalSize}" height="${totalSize}" fill="#ffffff"/>`;
        
        // Adicionar módulos pretos
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
              const x = (col + margin) * cellSize;
              const y = (row + margin) * cellSize;
              enhancedSvg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
            }
          }
        }
        
        enhancedSvg += '</svg>';
      }

      // Converter para Data URL
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(enhancedSvg)))}`;
    } catch (error) {
      console.error('Erro ao gerar QR Code simples:', error);
      return '';
    }
  };

  // Função para gerar QR code ultra simples (apenas código)
  const generateUltraSimpleQRCode = (code: string): string => {
    if (!window.qrcode) {
      console.warn('QR Code library not loaded');
      return '';
    }

    try {
      // Dados mínimos - apenas o código
      // Quanto menos dados, menos módulos, barras mais grossas
      const typeNumber = 1; // Versão 1 = 21x21 módulos (o mais grosso possível)
      const errorCorrectionLevel = 'L'; // Menos correção = menos módulos extras
      
      const qr = window.qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(code);
      qr.make();

      // Criar SVG com células grandes
      const moduleCount = qr.getModuleCount();
      const cellSize = 12; // Célula bem grande para barras grossas
      const margin = 2;
      const totalSize = (moduleCount + margin * 2) * cellSize;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">`;
      
      // Fundo branco
      svg += `<rect width="${totalSize}" height="${totalSize}" fill="#ffffff"/>`;
      
      // Módulos pretos
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = (col + margin) * cellSize;
            const y = (row + margin) * cellSize;
            svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
          }
        }
      }
      
      svg += '</svg>';

      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    } catch (error) {
      console.error('Erro ao gerar QR Code ultra simples:', error);
      return '';
    }
  };

  // Função wrapper para manter compatibilidade
  const generateQRCode = (text: string): string => {
    // Se o texto for muito longo, tentar extrair apenas o código
    if (text.length > 50) {
      try {
        const data = JSON.parse(text);
        if (data.ticketCode) {
          return generateUltraSimpleQRCode(data.ticketCode);
        }
      } catch {
        // Se não for JSON, usar o texto original mas tentar simplificar
        const match = text.match(/[A-Z0-9]{6,}/);
        if (match) {
          return generateUltraSimpleQRCode(match[0]);
        }
      }
    }
    
    // Para textos curtos, usar o gerador ultra simples
    if (text.length < 30) {
      return generateUltraSimpleQRCode(text);
    }
    
    // Fallback para o gerador simples
    const parts = text.split('|');
    if (parts.length >= 2) {
      return generateSimpleQRCode(parts[0], parts[1]);
    }
    
    return generateUltraSimpleQRCode(text.substring(0, 20));
  };

  return {
    qrCodeLoaded,
    generateQRCode,
    generateSimpleQRCode,
    generateUltraSimpleQRCode
  };
}