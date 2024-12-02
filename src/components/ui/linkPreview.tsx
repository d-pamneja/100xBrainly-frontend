"use client"
import { useState, useEffect } from 'react';
import { AiOutlineLink } from 'react-icons/ai';

const API_FLASH_KEY = import.meta.env.VITE_API_FLASH_KEY || (window as any).ENV?.API_FLASH_KEY || '';

const LinkPreview = ({ url }: { url: string }) => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        const screenshotResponse = await fetch(
          `https://api.apiflash.com/v1/urltoimage?access_key=${API_FLASH_KEY}&url=${encodeURIComponent(url)}&format=jpeg&width=1200&height=630`
        );
        
        if (screenshotResponse.ok) {
          setScreenshotUrl(screenshotResponse.url);
        }
        else{
          const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
          if (!response.ok) throw new Error('Failed to fetch preview');

          const data = await response.json();
          setPreviewData(data.data);
        }

        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);

        if (!response.ok) throw new Error('Failed to fetch preview');
        
        const data = await response.json();
        console.log(data)
        setPreviewData(data.data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreviewData();
    }
  }, [url]);

  const containerClasses = "flex flex-col gap-4 mt-20 relative aspect-[16/9] bg-white/10 rounded-lg";

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="absolute inset-0 animate-pulse flex items-start space-x-4 mt-4 bg-black/20 rounded-lg p-4 backdrop-blur-sm">
        <div className="w-20 h-20 bg-gray-700 rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-700 rounded w-2/3" />
        </div>
      </div>
      </div>
      
    );
  }

  if (error || !previewData) {
    return (
      <div className={containerClasses}>
        <div className="absolute inset-0 flex items-center space-x-2 mt-4 text-neutral-200 bg-black/20 rounded-lg p-4 backdrop-blur-sm">
        <AiOutlineLink className="w-5 h-5" />
        <span className="text-sm">{url}</span>
      </div>
      </div>
      
    );
  }

  return (
        <div className="flex flex-col gap-4 mt-20">
            {previewData.image?.url && (
                <div className="relative aspect-[16/9] bg-white/10 rounded-lg">
                    <img 
                        src={previewData.image.url} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover p-4 rounded-lg"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}
            {!previewData.image?.url && screenshotUrl && (
                  <div className="relative aspect-[16/9] bg-white/10 rounded-lg">
                    <img
                      src={screenshotUrl}
                      alt="Website Screenshot"
                      className="absolute inset-0 w-full h-full object-cover p-4 rounded-lg"
                    />
                  </div>
            )}
            {!screenshotUrl && !previewData.image?.url && previewData.description && (
                <div className="relative aspect-[16/9] bg-white/10 rounded-lg flex justify-center items-center"> 
                    <div className='text-white text-center'>
                      {previewData.description}
                    </div>
                </div>
            )}
            {!previewData.image?.url && !previewData.description && !screenshotUrl && (
              <div 
                className="flex items-center space-x-2 mt-4 text-neutral-200 bg-black/20 rounded-lg p-4 backdrop-blur-sm"
                style={{
                  maxWidth: `calc(100% - 40px)`, 
                  wordBreak: 'break-word', 
              }}
              >
                <AiOutlineLink className="w-5 h-5" />
                <span className="text-sm">{url}</span>
              </div>
            )}
        </div>
  );
};

export default LinkPreview;