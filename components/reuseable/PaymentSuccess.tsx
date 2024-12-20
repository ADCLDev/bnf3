// components/reuseable/PaymentSuccess
'use client'
import React, { useState } from 'react';
import { Download, FileText, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PurchasedFont {
  id: string;
  name: string;
  style: string;
  downloadUrl: string;
  downloadCount: number;
  maxDownloads: number;
  format: string;
  size: string;
  license: string;
}

interface PaymentSuccessProps {
  orderId: string;
  purchaseDate: string;
  totalAmount: number;
  purchasedFonts: PurchasedFont[];
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  orderId = '',
  purchaseDate = '',
  totalAmount = 0.0,
  purchasedFonts = []
}) => {
  const [isRegeneratingLinks, setIsRegeneratingLinks] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<{ [key: string]: boolean }>({});
  const [downloadError, setDownloadError] = useState<{ [key: string]: string }>({});

  const handleDownload = async (fontId: string, url: string) => {
    try {
      setDownloadError(prev => ({ ...prev, [fontId]: '' }));
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${purchasedFonts.find(f => f.id === fontId)?.name || 'font'}.ttf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadStatus(prev => ({ ...prev, [fontId]: true }));
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError(prev => ({ ...prev, [fontId]: 'Download failed. Please try again.' }));
    }
  };

  const handleRegenerateLinks = async () => {
    setIsRegeneratingLinks(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setDownloadStatus({});
      setDownloadError({});
    } catch (error) {
      console.error('Link regeneration failed:', error);
    } finally {
      setIsRegeneratingLinks(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`/api/invoice/${orderId}`);
      if (!response.ok) throw new Error('Failed to download invoice');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `invoice-${orderId}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Invoice download failed:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-100 to-slate-200 pb-8 shadow-md rounded-lg">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-green-50 p-4 rounded-full mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your fonts are ready to download.
          </p>
        </div>

        <div className="grid gap-8 rounded-lg">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-6">
              <CardTitle className="text-xl">Order Details</CardTitle>
              <CardDescription className="text-gray-500">
                Order #{orderId} • {purchaseDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Amount</span>
                  <span className="text-xl font-semibold text-gray-900">৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-sm">
                    Completed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-700">Credit Card</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button 
                variant="outline" 
                className="w-full hover:bg-gray-100 transition-colors"
                onClick={handleDownloadInvoice}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-6">
              <CardTitle className="text-xl">Your Fonts</CardTitle>
              <CardDescription className="text-gray-500">
                Download your purchased fonts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {purchasedFonts.map((font) => (
                <div 
                  key={font.id} 
                  className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{font.name}</h3>
                      <p className="text-gray-500">{font.style}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={downloadStatus[font.id] ? "ghost" : "default"}
                            className={downloadStatus[font.id] ? "bg-green-50 text-green-600 hover:bg-green-100" : ""}
                            onClick={() => handleDownload(font.id, font.downloadUrl)}
                            disabled={downloadStatus[font.id]}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {downloadStatus[font.id] ? 'Downloaded' : 'Download'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download {font.format} format</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {downloadError[font.id] && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {downloadError[font.id]}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-gray-500">Format:</span>
                      <span className="ml-2 text-gray-700 font-medium">{font.format}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <span className="ml-2 text-gray-700 font-medium">{font.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">License:</span>
                      <span className="ml-2 text-gray-700 font-medium">{font.license}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Downloads:</span>
                      <span className="ml-2 text-gray-700 font-medium">
                        {font.downloadCount}/{font.maxDownloads}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {purchasedFonts.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-gray-200 hover:bg-gray-50"
                  onClick={handleRegenerateLinks}
                  disabled={isRegeneratingLinks}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRegeneratingLinks ? 'animate-spin' : ''}`} />
                  {isRegeneratingLinks ? 'Regenerating Links...' : 'Regenerate Download Links'}
                </Button>
              )}
            </CardContent>
          </Card>

          <Alert className="bg-blue-50 border-blue-100 text-blue-800">
            <AlertTitle className="text-blue-900 font-semibold mb-2">
              Download Instructions
            </AlertTitle>
            <AlertDescription className="text-blue-800">
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Download links are valid for 24 hours</li>
                <li>Each font can be downloaded up to {purchasedFonts[0]?.maxDownloads} times</li>
                <li>Click &quot;Regenerate Download Links&quot; if your downloads expire</li>
                <li>Keep your invoice safe for future reference</li>
                <li>Check allowed usage terms before implementing fonts</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;