import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const readers: Promise<string>[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    }
    Promise.all(readers).then((newImages) => {
      onChange([...images, ...newImages]);
    });
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Product Images</label>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-violet-500 bg-violet-50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
      >
        <Upload className="mx-auto mb-3 h-8 w-8 text-slate-400" />
        <p className="text-sm text-slate-600">
          <span className="font-medium text-violet-600">Click to upload</span> or drag and drop
        </p>
        <p className="mt-1 text-xs text-slate-400">PNG, JPG, GIF or WebP up to 10MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <img src={src} alt={`Product ${idx + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-1 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
          <ImageIcon className="h-3.5 w-3.5" />
          No images uploaded yet
        </div>
      )}
    </div>
  );
}
