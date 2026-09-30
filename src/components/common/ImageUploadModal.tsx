import React, { useState } from 'react';
import { X, Upload, Link, Check, Image as ImageIcon } from 'lucide-react';
import { THUMB_DESK, THUMB_FINANCE, PROD_BOTTLE, PROD_WALLET } from '../../data/defaultScenarios';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentImage: string;
  onSaveImage: (newImageUrl: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  title,
  currentImage,
  onSaveImage,
}) => {
  const [urlInput, setUrlInput] = useState(currentImage);
  const [preview, setPreview] = useState(currentImage);

  if (!isOpen) return null;

  const presetImages = [
    { label: 'Studio Desk', url: THUMB_DESK },
    { label: 'Finance Chart', url: THUMB_FINANCE },
    { label: 'Travertine Bottle', url: PROD_BOTTLE },
    { label: 'Titanium Wallet', url: PROD_WALLET },
    {
      label: 'Founder Male',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    },
    {
      label: 'Founder Female',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces',
    },
    {
      label: 'Executive',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = String(event.target.result);
          setPreview(resultStr);
          setUrlInput(resultStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onSaveImage(preview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#161618] border border-white/10 p-5 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Image Preview */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-4 flex items-center justify-center">
          <img
            src={preview}
            alt="Preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={() => {
              // fallback
            }}
          />
        </div>

        {/* Local File Upload Button */}
        <div className="mb-4">
          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white cursor-pointer transition active:scale-98">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo from Phone / Device</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Image URL Input */}
        <div className="mb-4">
          <span className="text-[11px] text-slate-400 block mb-1">Or paste Image URL:</span>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setPreview(e.target.value);
              }}
              className="flex-1 rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Presets */}
        <div className="mb-5">
          <span className="text-[11px] text-slate-400 block mb-1.5">Quick Presets:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {presetImages.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPreview(preset.url);
                  setUrlInput(preset.url);
                }}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-medium text-slate-300"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
