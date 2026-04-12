"use client";

import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
  onToggleSidebar?: () => void;
}

export default function Header({ onMenuClick, onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 transition-all duration-300 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-400 hover:text-white hover:scale-110 active:scale-95"
              title="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-none">
                Admin Panel
              </h1>
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-1">
                Welcome {user?.name || "Admin"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm font-medium text-zinc-400">
              {user?.email}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200">
                  {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-900/90 backdrop-blur-xl border-white/10 text-white">
                <DropdownMenuLabel className="text-zinc-400 font-normal">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.email}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer rounded-lg m-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold text-white">Admin Panel</h1>
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest leading-none">Welcome</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all active:scale-95">
                <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900/90 backdrop-blur-xl border-white/10 text-white">
              <DropdownMenuLabel className="text-zinc-400 font-normal">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <div className="px-2 py-1.5 text-xs text-zinc-400 truncate">
                {user?.email}
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer rounded-lg m-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
