"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-x-0 rounded-none bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#bef264]/20 p-2 rounded-lg group-hover:bg-[#bef264]/40 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-[#d9f99d] group-hover:text-[#ecfccb] transition-colors" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Vexa AI</span>
        </Link>
        
        <div className="flex gap-8 items-center">
          <Link 
            href="/studio" 
            className={cn(
              "text-sm tracking-wide transition-all duration-300", 
              pathname === "/studio" ? "text-white font-semibold drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "text-white/50 hover:text-white"
            )}
          >
            Studio
          </Link>
          <Link 
            href="/favorites" 
            className={cn(
              "flex items-center gap-1.5 text-sm tracking-wide transition-all duration-300", 
              pathname === "/favorites" ? "text-white font-semibold drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "text-white/50 hover:text-white group"
            )}
          >
            <Heart className={cn("w-4 h-4 transition-colors", pathname === "/favorites" ? "fill-[#bef264] text-[#bef264]" : "group-hover:text-red-400")} />
            <span>Favorites</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
