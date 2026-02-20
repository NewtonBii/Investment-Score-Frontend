import React from 'react';
import { LayoutDashboard, Upload, Bell, LogOut, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
interface NavbarProps {
  onLogout: () => void;
}
export function Navbar({ onLogout }: NavbarProps) {
  const { user } = useAuth();
  const initials = user?.name ?
  user.name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2) :
  '?';
  return (
    <nav className="w-full h-16 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-teal-800 flex items-center justify-center">
              <span className="font-mono font-bold text-background text-lg">
                I
              </span>
            </div>
            <span className="text-lg font-medium tracking-tight text-white">
              Investor<span className="text-primary">Lens</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <NavLink
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              active />

            <NavLink icon={<Upload size={16} />} label="Upload" />
            <NavLink icon={<History size={16} />} label="History" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-xs font-bold text-primary font-mono">
                  {initials}
                </span>
              </div>
              {user?.name &&
              <span className="hidden sm:block text-sm text-gray-300 font-medium">
                  {user.name}
                </span>
              }
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-danger transition-colors"
              title="Logout">

              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>);

}
function NavLink({
  icon,
  label,
  active = false




}: {icon: React.ReactNode;label: string;active?: boolean;}) {
  return (
    <a
      href="#"
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200
        ${active ? 'text-white bg-white/5 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}
      `}>

      {icon}
      <span>{label}</span>
    </a>);

}