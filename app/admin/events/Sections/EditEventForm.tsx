import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Image from "next/image";
import { 
  Info, 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  CreditCard, 
  Image as ImageIcon, 
  Save, 
  Upload 
} from "lucide-react";
import { eventsApi } from "@/services/api";
import { fileToBase64, validateImageFile } from '@/utils/file';
import { Event } from "@/types";

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Short description is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  venue: z.string().min(1, "Venue is required"),
  category: z.string().min(1, "Category is required"),
  registrationFee: z.string().optional(),
  upiID: z.string().optional(),
  details: z.string().min(1, "Full details are required"),
  is_upcoming: z.boolean().catch(true),
  registration_open: z.boolean().catch(false),
  whatsappLink: z.string().min(1, "Whatsapp link is required"),
  contactInfo: z.array(z.object({
    name: z.string().min(1, "Contact name is required"),
    mobile: z.string().min(10, "Valid mobile number is required"),
    year: z.string().min(1, "Year is required"),
  })).catch([]),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EditEventFormProps {
  initialData?: Event;
  isEdit?: boolean;
  onSuccess: () => void;
}

function EditEventForm({ initialData, isEdit = false, onSuccess }: EditEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventBanner, setEventBanner] = useState<File | null>(null);
  const [poster, setPoster] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.eventBanner?.url || null);
  const [posterPreview, setPosterPreview] = useState<string | null>(initialData?.poster?.url || null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "workshop",
      venue: initialData?.venue || "",
      eventDate: initialData?.eventDate || "",
      eventTime: initialData?.eventTime || "",
      registrationFee: initialData?.registrationFee || "",
      upiID: initialData?.upiID || "",
      details: initialData?.details || "",
      is_upcoming: initialData?.is_upcoming ?? true,
      whatsappLink: initialData?.whatsappLink || "",
      registration_open: initialData?.registration_open ?? false,
      contactInfo: initialData?.contactInfo || [{ name: "", mobile: "", year: "" }],
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "contactInfo" });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const err = validateImageFile(file);
      if (err) {
        toast.error(err);
        return;
      }
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: EventFormData) => {
    setIsSubmitting(true);
    try {
      const payload: any = { ...values };
      
      if (eventBanner) {
        payload.eventBanner = await fileToBase64(eventBanner);
      }
      if (poster) {
        payload.poster = await fileToBase64(poster);
      }

      let response;
      if (isEdit && initialData?._id) {
        response = await eventsApi.updateEvent(initialData._id, payload);
      } else {
        response = await eventsApi.createEventJson(payload);
      }

      if (response.data && response.data.success) {
        toast.success(isEdit ? "Event updated successfully" : "Event created successfully");
        onSuccess();
      } else {
        toast.error(response.data?.message || "Failed to process event");
      }
    } catch (err) {
      console.error("Form error:", err);
      toast.error("An error occurred while saving the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-8">
          {/* Media Section */}
          <section className="bg-[#0A0A0A] p-8 md:p-10 rounded-[2.5rem] border border-zinc-900 shadow-2xl space-y-8">
            <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-6">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Event Media</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block">Event Banner</label>
                <div className="relative group aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/50 transition-all">
                  {bannerPreview ? (
                    <>
                      <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => { setBannerPreview(null); setEventBanner(null); }} className="p-3 bg-red-500 rounded-full text-white shadow-xl hover:scale-110 transition-transform">
                          <X size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800/50 transition-colors">
                      <Upload className="text-indigo-400 mb-3" size={32} />
                      <span className="text-xs font-bold text-zinc-400">Upload Banner</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setEventBanner, setBannerPreview)} />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block">Event Poster</label>
                <div className="relative group aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/50 transition-all max-w-[240px] mx-auto">
                  {posterPreview ? (
                    <>
                      <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => { setPosterPreview(null); setPoster(null); }} className="p-3 bg-red-500 rounded-full text-white shadow-xl hover:scale-110 transition-transform">
                          <X size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800/50 transition-colors">
                      <Upload className="text-indigo-400 mb-3" size={32} />
                      <span className="text-xs font-bold text-zinc-400">Upload Poster</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setPoster, setPosterPreview)} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#0A0A0A] p-8 md:p-10 rounded-[2.5rem] border border-zinc-900 shadow-2xl space-y-8">
            <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-6">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Event Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-full">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 mb-3">
                  <Info size={12} className="text-indigo-400" />
                  Event Name
                </label>
                <input 
                  {...register("name")} 
                  className="w-full bg-[#141414] border border-zinc-800 rounded-2xl px-6 py-4 text-base font-bold text-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                  placeholder="Enter event name" 
                />
                {errors.name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Category</label>
                <select {...register("category")} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-indigo-600 outline-none">
                   <option value="workshop">Workshop</option>
                   <option value="seminar">Seminar</option>
                   <option value="hackathon">Hackathon</option>
                   <option value="meetup">Meetup</option>
                   <option value="conference">Conference</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Venue</label>
                <input {...register("venue")} placeholder="Event Venue" className="w-full bg-[#141414] border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-600" />
                {errors.venue && <p className="text-red-500 text-xs mt-2 font-bold">{errors.venue.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                    <input type="date" {...register("eventDate")} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-600" />
                  </div>
                  {errors.eventDate && <p className="text-red-500 text-xs mt-2 font-bold">{errors.eventDate.message}</p>}
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Event Time</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                    <input type="time" {...register("eventTime")} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-600" />
                  </div>
                  {errors.eventTime && <p className="text-red-500 text-xs mt-2 font-bold">{errors.eventTime.message}</p>}
               </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Short Description</label>
              <textarea {...register("description")} rows={3} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-600 resize-none h-32" placeholder="Brief overview of the event..." />
              {errors.description && <p className="text-red-500 text-xs mt-2 font-bold">{errors.description.message}</p>}
            </div>
            
             <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Full Details</label>
              <textarea {...register("details")} rows={5} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-600 resize-none" placeholder="Complete event details..." />
              {errors.details && <p className="text-red-500 text-xs mt-2 font-bold">{errors.details.message}</p>}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-[#0A0A0A] p-8 md:p-10 rounded-[2.5rem] border border-zinc-900">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Contact Persons</h3>
              <button type="button" onClick={() => append({ name: "", mobile: "", year: "" })} className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-black hover:scale-110 transition-all">
                <Plus size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field, idx) => (
                <div key={field.id} className="bg-[#141414] p-6 rounded-3xl border border-zinc-800 space-y-4 group">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Contact #{idx + 1}</div>
                    <button type="button" onClick={() => remove(idx)} className="text-zinc-600 hover:text-red-500 transition-colors">
                       <X size={16} />
                    </button>
                  </div>
                  <input {...register(`contactInfo.${idx}.name`)} placeholder="Full Name" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                     <input {...register(`contactInfo.${idx}.mobile`)} placeholder="Mobile Number" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold" />
                     <input {...register(`contactInfo.${idx}.year`)} placeholder="Year" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* Status Switches */}
          <section className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-zinc-900 space-y-6">
             <div className="flex items-center justify-between group">
               <div>
                  <div className="text-sm font-black uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">Upcoming Event</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Status toggle</div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register("is_upcoming")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
               </label>
             </div>

             <div className="flex items-center justify-between group">
               <div>
                  <div className="text-sm font-black uppercase tracking-tighter group-hover:text-green-500 transition-colors">Registration Open</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Accepting responses</div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register("registration_open")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
               </label>
             </div>
          </section>

          {/* Pricing & Links */}
          <section className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-zinc-900 space-y-6">
             <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">Registration Fee</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input {...register("registrationFee")} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none" placeholder="Amount or Free" />
                </div>
             </div>
             
             <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">UPI ID</label>
                <input {...register("upiID")} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl px-6 py-4 text-xs font-mono text-indigo-400 outline-none" placeholder="example@upi" />
             </div>

             <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block">WhatsApp Link</label>
                <input {...register("whatsappLink")} className="w-full bg-[#141414] border border-zinc-800 rounded-2xl px-6 py-4 text-[10px] font-medium text-emerald-500 outline-none" placeholder="chat.whatsapp.com/..." />
                {errors.whatsappLink && <p className="text-red-500 text-[10px] mt-2 font-bold">{errors.whatsappLink.message}</p>}
             </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/5 disabled:opacity-50"
          >
            {isSubmitting ? <span className="animate-spin text-zinc-400"><Save size={20} /></span> : <Save size={20} />}
            {isEdit ? "Update System" : "Publish Event"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditEventForm;
