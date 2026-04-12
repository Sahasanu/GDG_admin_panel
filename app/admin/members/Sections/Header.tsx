"use client";
import { useRouter } from 'next/navigation'
import CustomDropdown from '@/components/ui/Dropdown'

function Header({stats,refreshMembers,isLoading,searchQuery,setSearchQuery,statusFilter,setStatusFilter}:any) {
    const router = useRouter()
  return (
     <div className="mb-4 sm:mb-6 flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Members</h1>

            <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
              {stats.map((stat:any) => {
                return (
                  <span key={stat.key} className="shadow-md text-white border border-gray-700 p-1 px-2 rounded-full bg-zinc-800/90">
                    {stat.label}: {stat.value}
                  </span>
                )
              })}
            </div>

          </div>
          <div className="flex gap-2">
            <button
              aria-label="Refresh members"
              onClick={refreshMembers}
              className="flex items-center justify-center rounded-full bg-blue-500 p-2 sm:px-3 sm:py-1 text-sm text-white shadow-sm hover:bg-blue-600 border border-zinc-900"
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
              onClick={() => router.push('/admin/members/add')}
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
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 border border-zinc-900 px-2 bg-[#18181B] py-2 rounded-lg sm:rounded-full shadow-md">
          <div className="flex gap-2 w-full sm:w-auto" >
            <CustomDropdown
              value={statusFilter}
              className="w-40 sm:w-44 border-none"
              options={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              placeholder={statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              onChange={(option: any) => setStatusFilter(option.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto bg-[#141417] text-white rounded-full px-4 py-2 text-sm border border-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
          />
        </div>
      </div>
  )
}

export default Header