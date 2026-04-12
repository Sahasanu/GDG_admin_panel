"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { eventsApi } from "@/services/api";
import { Event } from "@/types";
import EditEventForm from "../../Sections/EditEventForm";

export default function EditEventPage() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const eventId = (routeParams?.id as string) || "";
  const [isLoading, setIsLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await eventsApi.getEventById(eventId);
        if (response.data && response.data.success) {
          setCurrentEvent(response.data.event);
        } else {
          setError("Protocol Failure: Event data inaccessible.");
          toast.error("Failed to load event data");
        }
      } catch (err) {
        setError("System Error: Critical failure during fetch.");
        toast.error("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = (
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void
  ) => {
    setFile(null);
    setPreview(null);
  };

  const onSubmit: SubmitHandler<EventFormData> = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const payload: Partial<EventFormData> & { [key: string]: unknown } = { ...data };

      payload.is_upcoming = Boolean(data.is_upcoming);
      payload.registration_open = Boolean(data.registration_open);

      if (eventBanner) {
        const imgErr = validateImageFile(eventBanner);
        if (imgErr) throw new Error(imgErr);
        payload.eventBanner = await fileToBase64(eventBanner);
      }
      if (poster) {
        const imgErr = validateImageFile(poster);
        if (imgErr) throw new Error(imgErr);
        payload.poster = await fileToBase64(poster);
      }

      const response = await eventsApi.updateEvent(eventId, payload);

      if (response.data && response.data.success) {
        toast.success("Event updated successfully");
        router.push("/admin/events");
      } else {
        toast.error(response.data?.message || "Failed to update event");
      }
    } catch (err: unknown) {
      console.error("Error updating event:", err);
      // Log detailed error info if available
      if (err && typeof err === 'object' && 'response' in err) {
        console.log("Error Response Data:", (err as any).response?.data);
      }

      const errorMessage = err instanceof Error && 'message' in err
        ? (err as Error).message
        : err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to update event";
      toast.error(errorMessage || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Data...</span>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-red-500 font-black italic uppercase tracking-tighter text-4xl">System Error</div>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{error || "Entry Not Found"}</p>
        <button onClick={() => router.push("/admin/events")} className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Return to Hub</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-4 mb-12">
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="group rounded-2xl p-3 bg-[#0A0A0A] border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Modify Entry</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Protocol: Updating Event {currentEvent.name}
          </p>
        </div>
      </div>

      <EditEventForm 
        initialData={currentEvent} 
        isEdit={true} 
        onSuccess={() => router.push("/admin/events")} 
      />
    </div>
  );
}
