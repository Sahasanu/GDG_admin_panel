import React, { useState, useEffect } from 'react';
import { Users, Clock, MapPin, Tag, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsApi } from '@/services/api';
import { Participant, EventParticipantsResponse as ParticipantsResponse } from '@/types';

interface ParticipantsTabProps {
  eventId: string;
}

function ParticipantsTab({ eventId }: ParticipantsTabProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "department" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      try {
        const response = await eventsApi.getEventParticipants(eventId);
        if (response.data && response.data.success) {
          const data = response.data as ParticipantsResponse;
          setParticipants(data.participants || []);
          setTotalParticipants(data.totalParticipants || 0);
        }
      } catch (err) {
        console.error("Error fetching participants:", err);
        toast.error("Failed to load participants");
      } finally {
        setIsLoading(false);
      }
    };
    fetchParticipants();
  }, [eventId]);

  const filteredParticipants = participants
    .filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "department") {
        comparison = (a.department || "").localeCompare(b.department || "");
      } else if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const last24hCount = participants.filter(p => {
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    return new Date(p.createdAt) > yesterday;
  }).length;

  const uniqueDepartments = new Set(participants.map(p => p.department)).size;
  
  const deptMap: Record<string, number> = {};
  participants.forEach(p => {
    if (p.department) {
      deptMap[p.department] = (deptMap[p.department] || 0) + 1;
    }
  });
  const topDept = Object.entries(deptMap).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";

  const exportCSV = () => {
    const headers = ["Name", "Email", "Department", "Roll No", "Phone"];
    const csvContent = [
      headers.join(","),
      ...participants.map(p => `"${p.name}","${p.email}","${p.department}","${p.classRollNo}","${p.phoneNumber}"`)
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants-${eventId}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Participants", value: totalParticipants, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/5" },
          { label: "Registered Today", value: `+${last24hCount}`, icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/5" },
          { label: "Total Departments", value: uniqueDepartments, icon: MapPin, color: "text-amber-400", bg: "bg-amber-500/5" },
          { label: "Top Department", value: topDept, icon: Tag, color: "text-purple-400", bg: "bg-purple-500/5" },
        ].map((stat, i) => (
          <div key={i} className={`p-2 px-4 rounded-2xl border border-zinc-900 ${stat.bg} space-y-1 relative overflow-hidden group hover:border-zinc-700 transition-all`}>
            <div className="flex gap-2 items-center">
              <stat.icon className={`${stat.color} opacity-50`} size={14} />
               <div className="text-base font-black truncate">{stat.value}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-[#141414] border border-zinc-800 p-1 rounded-xl">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-zinc-400 px-3 py-1.5 outline-none cursor-pointer hover:text-white transition-colors"
            >
              <option value="name">Name</option>
              <option value="department">Department</option>
              <option value="createdAt">Date</option>
            </select>
            <div className="w-[1px] h-4 bg-zinc-800"></div>
            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 px-3 py-1.5 transition-colors"
            >
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold transition-all w-full sm:w-auto shadow-xl"
          >
            <Download size={16} />
            Export Participants
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-[#0A0A0A] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Academic Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Filled On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8"><div className="h-4 bg-zinc-900 rounded w-full"></div></td>
                  </tr>
                ))
              ) : paginatedParticipants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-medium italic">No participants found.</td>
                </tr>
              ) : (
                paginatedParticipants.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">{p.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-zinc-300">{p.department}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Roll: {p.classRollNo}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400 font-medium">
                      <div>{p.email}</div>
                      <div className="text-xs text-zinc-500 mt-1">{p.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-zinc-500 font-bold">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-800 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-800 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantsTab;