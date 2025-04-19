"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navbarClasses = `fixed w-full transition-all duration-300 z-10 ${
    scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-2" : "bg-transparent py-4"
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image 
                src="/SafeSpaceLogo3.png" 
                alt="SafeSpace Logo" 
                width={140} 
                height={35} 
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center space-x-1">
            <Link 
              href="/" 
              className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200
                ${isActive('/') 
                  ? 'text-white bg-black' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200
                ${isActive('/about') 
                  ? 'text-white bg-black' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/journal" 
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200
                    ${isActive('/journal') 
                      ? 'text-white bg-black' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
                >
                  Journal
                </Link>
                <Link 
                  href="/profile" 
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200
                    ${isActive('/profile') 
                      ? 'text-white bg-black' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
                >
                  Profile
                </Link>
                <div className="ml-3 pl-3 border-l border-gray-200">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-sm font-medium text-gray-800 mr-2">
                      {user?.username.charAt(0).toUpperCase()}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      className="text-gray-500 hover:text-black text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-black border border-transparent hover:border-gray-200 rounded-full transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="ml-2 px-5 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-full shadow-sm transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 focus:outline-none transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="pt-2 pb-4 px-2 space-y-1">
            <Link 
              href="/" 
              className={`block px-4 py-2 text-base font-medium rounded-lg ${
                isActive('/') ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-4 py-2 text-base font-medium rounded-lg ${
                isActive('/about') ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/journal" 
                  className={`block px-4 py-2 text-base font-medium rounded-lg ${
                    isActive('/journal') ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Journal
                </Link>
                <Link 
                  href="/profile" 
                  className={`block px-4 py-2 text-base font-medium rounded-lg ${
                    isActive('/profile') ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                
                <div className="mt-4 pt-4 border-t border-gray-200 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100">
                          <span className="text-sm font-medium text-gray-800">
                            {user?.username.charAt(0).toUpperCase()}
                          </span>
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{user?.username}</div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="ml-auto px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 px-4 flex flex-col space-y-2">
                <Link 
                  href="/auth/login" 
                  className="w-full px-4 py-2 text-center text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="w-full px-4 py-2 text-center text-base font-medium text-white bg-black hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}