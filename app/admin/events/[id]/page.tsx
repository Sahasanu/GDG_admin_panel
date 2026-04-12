"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { 
  Users, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  ArrowLeft,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  CreditCard,
  Save,
  X,
  Upload,
  CheckCircle2,
  Info
} from "lucide-react";
import { eventsApi } from "@/services/api";
import { Event } from "@/types";
import GalleryTab from "../Sections/GalleryTab";
import ParticipantsTab from "../Sections/ParticipantsTab";
import ReviewTab from "../Sections/ReviewTab";
import EditEventForm from "../Sections/EditEventForm";



export default function EventDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<"participants" | "reviews" | "gallery" | "edit">("participants");
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load basic event data
  const fetchEventData = useCallback(async () => {
    try {
      const response = await eventsApi.getEventById(eventId);
      if (response.data && response.data.success) {
        setEventData(response.data.event);
      }
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      fetchEventData().finally(() => setIsLoading(false));
    }
  }, [eventId, fetchEventData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202]">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#020202] text-white">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <button onClick={() => router.push("/admin/events")} className="mt-4 text-indigo-400 hover:underline">Back to Events</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-[#020202] text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-8xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/events")}
              className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{eventData.name}</h1>
              <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">{activeTab.replace('_', ' ')}</p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-zinc-900 overflow-x-auto no-scrollbar">
            {[
              { id: "participants", icon: Users, label: "Participants" },
              { id: "reviews", icon: MessageSquare, label: "Reviews" },
              { id: "gallery", icon: ImageIcon, label: "Gallery" },
              { id: "edit", icon: Settings, label: "Edit Event" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "participants" && <ParticipantsTab eventId={eventId} />}
        {activeTab === "reviews" && <ReviewTab eventId={eventId} />}
        {activeTab === "gallery" && <GalleryTab eventId={eventId} eventData={eventData} onSuccess={fetchEventData} />}
        {activeTab === "edit" && <EditEventForm initialData={eventData} isEdit={true} onSuccess={fetchEventData} />}
      </div>
    </div>
  );
}
