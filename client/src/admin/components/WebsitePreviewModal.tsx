import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WebsitePreviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!isOpen) return null;

  const resortSlug = user?.resort?.slug || 'grand-royal';
  const previewUrl = `/?resort=${resortSlug}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-amber-400">Live Website Preview</h3>
            <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full font-mono">
              {user?.resort?.name || 'Resort'} ({previewUrl})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IFrame */}
        <div className="flex-1 bg-slate-950">
          <iframe
            src={previewUrl}
            title="Resort Website Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
