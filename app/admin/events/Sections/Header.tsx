import React from 'react'
import CustomDropdown from '@/components/ui/Dropdown'

interface HeaderProps {
  filteredEvents: any[];
  refreshEvents: () => void;
  isLoading: boolean;
  setActiveFilter: (filter: string) => void;
  activeFilter: string;
  filters: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  router: any;
}

function Header({ 
  filteredEvents, 
  refreshEvents, 
  isLoading, 
  setActiveFilter, 
  activeFilter, 
  filters, 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  sortOrder, 
  setSortOrder, 
  router 
}: HeaderProps) {
  return (
    <div className="mb-4 sm:mb-6 flex flex-col space-y-3 sm:space-y-4">
      <div className="flex justify-between sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center px-1 sm:px-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">Events</h1>
          <span className="ml-2 sm:ml-4 text-xs sm:text-sm shadow-md text-white border border-zinc-900 p-1 px-2 rounded-full bg-[#18181B]">
            Total: {filteredEvents.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Refresh events"
            onClick={refreshEvents}
            className="flex items-center justify-center rounded-full bg-blue-500 p-2 sm:px-3 sm:py-1 text-sm text-white shadow-sm hover:bg-[#141417] border border-zinc-900"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={() => router.push('/admin/events/add')}
            className="flex items-center rounded-full bg-blue-500 px-4 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base text-white shadow-sm hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 border border-zinc-900 px-4 bg-[#18181B] py-2 rounded-2xl sm:rounded-full shadow-md z-[60]">
       <div className=' flex gap-2 justify-between'>
        <div className="flex gap-2 w-full  sm:w-auto text-zinc-400">
          <CustomDropdown
            value={activeFilter}
            className="w-40 sm:w-44"
            options={filters.map((f: string) => ({
              label: f === "all" ? "All" : f === "registration_open" ? "Reg Open" : f.charAt(0).toUpperCase() + f.slice(1),
              value: f
            }))}
            placeholder={activeFilter === "all" ? "All" : activeFilter === "registration_open" ? "Reg Open" : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            onChange={(option: any) => setActiveFilter(option.value)}
          />
        </div>

        <div className="flex items-center border px-3  rounded-full bg-black">

          <CustomDropdown
            value={sortBy}
            className="w-24 sm:w-24 border-none"
            options={[
              { label: "Date", value: "date" },
              { label: "Name", value: "name" },
            ]}
            placeholder={sortBy === "date" ? "Date" : "Name"}
            onChange={(option: any) => setSortBy(option.value)}
          />
          <div className="w-[1px] h-3 bg-zinc-800 mx-1"></div>
          <button
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 px-1 transition-colors"
          >
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">

          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto rounded-full bg-[#141417] text-white shadow-sm px-5 py-2 text-sm border border-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-600 transition-all font-medium"
          />
        </div>
      </div>
    </div>
  )
}

export default Header