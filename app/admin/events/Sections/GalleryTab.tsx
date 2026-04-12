import React, { useState } from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsApi } from '@/services/api';
import { fileToBase64 } from '@/utils/file';
import { Event } from '@/types';

interface GalleryTabProps {
  eventId: string;
  eventData: Event;
  onSuccess: () => void;
}

function GalleryTab({ eventId, eventData, onSuccess }: GalleryTabProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newImagesBase64 = await Promise.all(
        Array.from(files).map(async (file) => {
          return await fileToBase64(file);
        })
      );

      // Use the specific upload gallery endpoint
      const response = await eventsApi.uploadGallery(eventId, newImagesBase64);
      if (response.data && response.data.success) {
        toast.success(`${newImagesBase64.length} images added successfully`);
        onSuccess();
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
      toast.error("Failed to upload images.");
    } finally {
      setIsUploading(false);
      // Clear input
      e.target.value = '';
    }
  };

  const removeImage = async (public_id: string) => {
    if (!public_id) {
      toast.error("Cannot delete image without public ID");
      return;
    }

    try {
      // Use the specific update gallery endpoint to remove specific image
      const response = await eventsApi.updateGallery(eventId, [], [public_id]);
      if (response.data && response.data.success) {
        toast.success("Image deleted");
        onSuccess();
      }
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-[#0A0A0A] p-6 rounded-[2rem] border border-zinc-900">
        <div>
          <h3 className="text-lg font-bold">Event Gallery</h3>
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-1">
            {eventData.gallery?.length || 0} Images
          </p>
        </div>
        <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={16} />
          Add Images
          <input type="file" multiple className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isUploading && (
          <div className="aspect-square rounded-[2rem] border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center text-indigo-400 gap-3 animate-pulse">
            <Upload size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Processing...</span>
          </div>
        )}
        
        {eventData.gallery && eventData.gallery.length > 0 ? (
          eventData.gallery.map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-zinc-900 bg-zinc-900/50">
              <img src={img.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={() => removeImage(img.public_id)}
                  className="bg-red-500/20 hover:bg-red-500 border border-red-500/30 p-4 rounded-3xl text-red-500 hover:text-white transition-all shadow-xl"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : !isUploading && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No visual evidence captured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryTab;