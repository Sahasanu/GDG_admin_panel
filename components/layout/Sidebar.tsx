"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isSuperAdmin } from "@/utils/roleCheck";
import { ShieldUser,SquareActivity,HeartHandshake   } from 'lucide-react';


// Navigation items for the sidebar
const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    name: "Members",
    href: "/admin/members",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    name: "Event",
    href: "/admin/events",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5M9 12.75h6m-6 3h6"
        />
      </svg>
    ),
  },
  {
    name: "Recruitment",
    href: "/admin/recruitment",
    icon: (
      <HeartHandshake strokeWidth={1.5} size={20}/>
    ),
  },
  {
    name: "Settings",
    href: "/admin/Settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },

];

// Super Admin nav items
const superAdminNavItems = [
  {
    name: "Admin Management",
    href: "/admin/superadmin/admins",
    icon: (
     <ShieldUser strokeWidth={1.5} size={20}/>
    ),
  },
  {
    name: "Activity Logs",
    href: "/admin/superadmin/activity-logs",
    icon: (
   <SquareActivity strokeWidth={1.5} size={20}/>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
}

export default function Sidebar({ isOpen, onClose, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const superAdmin = isSuperAdmin(user);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-black backdrop-blur-md text-white border-r border-white/10
        transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'w-64'}
        flex flex-col
        overflow-hidden
        scrollbar-hide
      `}>
        <div className={`pt-4 pl-8    flex items-center ${isCollapsed ? 'lg:justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex gap-4 items-center">
              <Image
                src="/logo-gdg.png"
                alt="GDG Logo"
                width={50}
                height={2}
                className="w-10 h-5 "
                priority
              />
              <h1 className="text-xl font-bold text-white tracking-tight">GDG</h1>
            </div>
          )}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 scrollbar-hide">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                    isCollapsed 
                      ? 'lg:p-3 lg:w-12 lg:h-12 lg:mx-auto lg:justify-center' 
                      : 'px-4 py-2'
                  } ${pathname === item.href
                    ? "bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className={`flex-shrink-0 transition-transform duration-200 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="ml-3 font-medium">{item.name}</span>}
                  
                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 shadow-xl ml-2">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            
            {/* Super Admin Items */}
            {superAdmin && (
              <>
                {!isCollapsed && (
                  <li className="px-4 py-2 mt-4">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Super Admin</h3>
                  </li>
                )}
                <div className="space-y-1">
                  {superAdminNavItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => onClose()}
                        className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                          isCollapsed 
                            ? 'lg:p-3 lg:w-12 lg:h-12 lg:mx-auto lg:justify-center' 
                            : 'px-4 py-2'
                        } ${pathname.startsWith(item.href.split('/').slice(0, -1).join('/'))
                          ? "bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <span className={`flex-shrink-0 transition-transform duration-200 ${pathname.startsWith(item.href) ? 'scale-110' : 'group-hover:scale-110'}`}>
                          {item.icon}
                        </span>
                        {!isCollapsed && <span className="ml-3 font-medium">{item.name}</span>}
                        
                        {/* Tooltip for collapsed mode */}
                        {isCollapsed && (
                          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 shadow-xl ml-2">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </div>
              </>
            )}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <button
            onClick={logout}
            className={`flex items-center rounded-xl transition-all duration-200 group relative text-zinc-400 hover:text-red-400 hover:bg-red-500/10 ${
              isCollapsed 
                ? 'lg:p-3 lg:w-12 lg:h-12 lg:mx-auto lg:justify-center' 
                : 'w-full px-4 py-2'
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 flex-shrink-0 transition-transform group-hover:-translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
            
            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 shadow-xl ml-2">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
