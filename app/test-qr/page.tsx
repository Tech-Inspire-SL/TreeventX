'use client';

import { QrCodeGenerator } from '@/components/tickets/qr-code-generator';

export default function TestQRPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">QR Code Test</h1>
      <div className="space-y-4">
        <h2 className="text-lg">Test QR Code with TreeventX Logo:</h2>
        <QrCodeGenerator qrToken="test-ticket-12345" />
      </div>
      <div className="space-y-4">
        <h2 className="text-lg">Another Test QR:</h2>
        <QrCodeGenerator qrToken="another-test-67890" />
      </div>
    </div>
  );
}