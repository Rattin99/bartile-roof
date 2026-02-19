import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, File, FileImage } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export function FileUploader({ 
  onUploadComplete, 
  value, 
  accept = '*', 
  label = 'Upload File',
  className 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
        // Simulate progress since fetch doesn't support it natively for uploads easily
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data.url);
      
    } catch (err) {
      setError(err.message);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    onUploadComplete('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const isImage = value && (value.match(/\.(jpeg|jpg|png|webp|svg)$/i));

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative border rounded-lg p-4 bg-muted/20 flex items-center gap-4">
            {isImage ? (
                <div className="h-16 w-16 relative rounded overflow-hidden border bg-background shrink-0">
                    <img src={value} alt="Preview" className="object-cover w-full h-full" />
                </div>
            ) : (
                <div className="h-16 w-16 shrink-0 rounded flex items-center justify-center bg-background border">
                    <File className="h-8 w-8 text-muted-foreground" />
                </div>
            )}
            
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{value.split('/').pop()}</p>
                <p className="text-xs text-muted-foreground">Upload complete</p>
            </div>

            <Button variant="ghost" size="icon" onClick={clearFile} type="button">
                <X className="h-4 w-4" />
            </Button>
        </div>
      ) : (
        <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20",
                uploading && "opacity-50 cursor-not-allowed"
            )}
        >
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileSelect}
                accept={accept}
                disabled={uploading}
            />
            
            <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs text-muted-foreground">
                    {accept === '*' ? 'Any file' : accept.replace(/,/g, ', ')}
                </div>
            </div>
        </div>
      )}

      {uploading && (
          <div className="space-y-1">
              <Progress value={progress} className="h-1" />
              <p className="text-xs text-muted-foreground text-center">Uploading...</p>
          </div>
      )}

      {error && (
          <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
