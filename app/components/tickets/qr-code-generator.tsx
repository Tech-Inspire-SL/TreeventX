
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

export function QrCodeGenerator({ qrToken, logoSrc }: { qrToken: string | null, logoSrc?: string | null }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (qrToken) {
      const options: QRCode.QRCodeToDataURLOptions = {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H', // Use 'H' for high correction when adding a logo
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      };

      if (logoSrc) {
        const image = document.createElement('img');
        image.src = logoSrc;
        // Setting crossOrigin is important for images from other domains
        image.crossOrigin = 'Anonymous';
        image.onload = () => {
          QRCode.toDataURL(qrToken, options)
            .then(url => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const qrImage = document.createElement('img');
                qrImage.src = url;
                qrImage.onload = () => {
                    canvas.width = qrImage.width;
                    canvas.height = qrImage.height;
                    ctx.drawImage(qrImage, 0, 0);

                    const logoSize = canvas.width * 0.25; // Logo will cover 25% of the QR code width
                    const x = (canvas.width - logoSize) / 2;
                    const y = (canvas.height - logoSize) / 2;
                    
                    // Draw a white background for the logo
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
                    
                    ctx.drawImage(image, x, y, logoSize, logoSize);
                    setDataUrl(canvas.toDataURL());
                }
            })
            .catch((err: unknown) => {
                console.error(err);
            });
        };
        image.onerror = () => {
            // Fallback to QR code without logo if logo fails to load
            QRCode.toDataURL(qrToken, options)
                .then(url => setDataUrl(url))
                .catch(err => console.error(err));
        }
      } else {
        QRCode.toDataURL(qrToken, options)
            .then(url => {
                setDataUrl(url);
            })
            .catch((err: unknown) => {
                console.error(err);
            });
      }
    }
  }, [qrToken, logoSrc]);

  if (!qrToken) {
    return (
        <div className="w-[300px] h-[300px] bg-muted rounded-md flex flex-col items-center justify-center text-center p-4">
            <p className="font-semibold text-destructive">QR Code Error</p>
            <p className="text-sm text-muted-foreground">Could not generate QR code. Please try again later.</p>
        </div>
    );
  }

  if (!dataUrl) {
    return (
        <div className="w-[300px] h-[300px] bg-muted animate-pulse rounded-md"></div>
    );
  }

  return <Image src={dataUrl} alt="QR Code" width={300} height={300} unoptimized />;
}

