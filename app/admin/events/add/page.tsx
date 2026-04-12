"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import EditEventForm from "../Sections/EditEventForm";

export default function AddEventPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-12">
        <div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/events")}
              className="group rounded-2xl p-3 bg-[#0A0A0A] border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-xl"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="space-y-1">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Initialize Event</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Protocol: Create New Entry
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Form Component */}
      <EditEventForm 
        isEdit={false} 
        onSuccess={() => router.push("/admin/events")} 
      />
    </div>
  );
}
