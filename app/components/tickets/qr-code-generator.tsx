
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

/**
 * QrCodeGenerator - Generates QR codes with TreeventX platform logo embedded in center
 * 
 * This component always embeds the TreeventX logo in the center of QR codes,
 * regardless of any event-specific branding. The platform logo serves as:
 * - Brand recognition for TreeventX
 * - Security indicator showing authenticity
 * - Consistent visual identity across all tickets
 */

// Convert image to base64 data URL for reliable canvas usage
const getImageAsDataUrl = (imagePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`));
    img.src = imagePath;
  });
};

export function QrCodeGenerator({ qrToken, logoSrc }: { qrToken: string | null, logoSrc?: string | null }) {
  const [finalQrDataUrl, setFinalQrDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQrWithLogo = async () => {
      if (!qrToken) return;
      
      try {
        setIsLoading(true);
        console.log('🎯 Starting QR generation with TreeventX logo for token:', qrToken);
        
        // Step 1: Convert TreeventX logo to base64 first
        let logoDataUrl: string | null = null;
        try {
          logoDataUrl = await getImageAsDataUrl('/TreeventX_Logo.png');
          console.log('✅ TreeventX logo converted to base64');
        } catch (logoError) {
          console.warn('⚠️ Failed to load TreeventX logo, will generate QR without logo:', logoError);
        }
        
        // Step 2: Generate the base QR code
        const qrDataUrl = await QRCode.toDataURL(qrToken, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        console.log('✅ Base QR code generated');

        // Step 3: If no logo, just return the QR code
        if (!logoDataUrl) {
          setFinalQrDataUrl(qrDataUrl);
          setIsLoading(false);
          return;
        }

        // Step 4: Create canvas to combine QR + logo
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.log('❌ Canvas context not available, using base QR');
          setFinalQrDataUrl(qrDataUrl);
          setIsLoading(false);
          return;
        }

        canvas.width = 300;
        canvas.height = 300;

        // Step 5: Draw QR code on canvas
        const qrImage = new window.Image();
        
        qrImage.onload = () => {
          console.log('✅ QR image loaded, drawing to canvas');
          ctx.drawImage(qrImage, 0, 0, 300, 300);
          
          // Step 6: Draw TreeventX logo on top
          const logoImage = new window.Image();
          
          logoImage.onload = () => {
            console.log('✅ Logo image loaded, adding to center of QR');
            
            const logoSize = 60; // Size of logo in pixels
            const logoX = (300 - logoSize) / 2; // Center horizontally
            const logoY = (300 - logoSize) / 2; // Center vertically
            
            // Draw white circle background for logo visibility
            const centerX = 300 / 2;
            const centerY = 300 / 2;
            const bgRadius = logoSize / 2 + 10;
            
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(centerX, centerY, bgRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add subtle border around white circle
            ctx.strokeStyle = '#E5E5E5';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw the TreeventX logo in the center
            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            
            // Convert final canvas to data URL
            const finalDataUrl = canvas.toDataURL('image/png', 1.0);
            console.log('🎉 QR code with TreeventX logo generated successfully!');
            setFinalQrDataUrl(finalDataUrl);
            setIsLoading(false);
          };
          
          logoImage.onerror = () => {
            console.error('❌ Failed to draw logo on canvas');
            setFinalQrDataUrl(qrDataUrl);
            setIsLoading(false);
          };
          
          // Use the base64 logo data URL
          logoImage.src = logoDataUrl;
        };
        
        qrImage.onerror = () => {
          console.error('❌ QR code image failed to load');
          setFinalQrDataUrl(null);
          setIsLoading(false);
        };
        
        qrImage.src = qrDataUrl;
        
      } catch (error) {
        console.error('❌ QR code generation failed:', error);
        setFinalQrDataUrl(null);
        setIsLoading(false);
      }
    };

    generateQrWithLogo();
  }, [qrToken]);

  if (!qrToken) {
    return (
      <div className="w-[300px] h-[300px] bg-muted rounded-md flex flex-col items-center justify-center text-center p-4">
        <p className="font-semibold text-destructive">QR Code Error</p>
        <p className="text-sm text-muted-foreground">Could not generate QR code. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-[300px] h-[300px] bg-muted animate-pulse rounded-md flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Generating QR with logo...</p>
      </div>
    );
  }

  if (!finalQrDataUrl) {
    return (
      <div className="w-[300px] h-[300px] bg-muted rounded-md flex flex-col items-center justify-center text-center p-4">
        <p className="font-semibold text-destructive">Generation Failed</p>
        <p className="text-sm text-muted-foreground">Unable to create QR code.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Image 
        src={finalQrDataUrl} 
        alt="QR Code with TreeventX Logo" 
        width={300} 
        height={300} 
        unoptimized
        className="rounded-md border border-gray-200"
      />
      <p className="text-xs text-muted-foreground">QR Code with TreeventX Logo</p>
    </div>
  );
}

