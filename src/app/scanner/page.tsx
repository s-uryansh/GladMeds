'use client';

import { useState } from 'react';
import { ScanLine } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function ScannerPage() {
  const [image, setImage] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setResponse('');
  };

  const handleScan = async () => {
    if (!image) return;
    if (!productName.trim()) {
    setResponse('❗ Please enter the product name before scanning.');
    return;
  }

    setLoading(true);

    try {
      const { data } = await Tesseract.recognize(image, 'eng');
      const labelText = data.text.trim();

      const formData = new FormData();
      formData.append('file', image);
      formData.append('labelText', labelText);
      formData.append('productName', productName); 

      const res = await fetch('/api/scan-medicine', {
        method: 'POST',
        body: formData,
      });

      const dataJson = await res.json();
      setResponse(dataJson.result || 'No feedback from AI.');
    } catch (err) {
      console.error(err);
      setResponse('Scan failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-body-bg min-h-screen flex items-center justify-center py-20">
      <div className="container flex flex-col items-center justify-center max-w-3xl w-full px-4">
        <h1 className="text-center mb-8">Scan Medicine QR or Barcode</h1>

        <div className="w-full max-w-md mb-6">
          
          <label className="block text-sm text-lightblue mb-1">
            Product name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Crocin 500 Tablet"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-lightblue border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <label
          htmlFor="qr-upload"
          className="cursor-pointer border-4 border-dashed border-primary/60 bg-white/5 rounded-2xl w-full max-w-sm h-48 flex items-center justify-center transition hover:bg-white/10 mb-6"
        >
          <div className="text-center flex flex-col items-center gap-2 text-white">
            <ScanLine size={40} className="text-primary" />
            <span className="text-sm text-lightblue">
              Click to Upload QR / Barcode Image 
            </span>
            <span className='text-sm text-lightblue'>
              make sure image of QR/Barcode is clear
            </span>
            {image && (
              <span className="text-xs text-lightpurple mt-1">
                Selected: {image.name}
              </span>
            )}
          </div>
        </label>

        <input
          id="qr-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          onClick={handleScan}
          disabled={!image || loading}
          className="bg-primary text-white font-semibold px-6 py-2 rounded-xl transition disabled:opacity-50 hover:opacity-90"
        >
          {loading ? 'Scanning...' : 'Scan Now'}
        </button>

                  
        {/* ⚠️ Development Disclaimer remove this once done*/}
        <p className="text-sm text-yellow-400 mt-2 mb-4 text-center">
          ⚠️ This feature is still under development. Results might not be accurate.
        </p>

        {response && (
          <div className="mt-10 w-full max-w-2xl bg-tablebg border border-border p-6 rounded-xl text-lightpurple">
            <h2 className="text-lightsky text-xl font-semibold mb-2">AI Feedback</h2>
            <p className="whitespace-pre-wrap leading-7 text-lightpurple text-lg">
              {response}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
/*
  --Problem with qr/barcode--
  * code is able to decode barcode but ai is not able to fetch the product with that UPC number
  * cause: free service
  * fix: get a paid service
*/