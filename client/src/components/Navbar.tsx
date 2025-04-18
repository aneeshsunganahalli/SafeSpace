"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// You can update this interface later based on authentication status
interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function Navbar({ isAuthenticated = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* You can replace this with your actual logo */}
              <div className="w-8 h-8 bg-black rounded-full mr-2"></div>
              <span className="font-bold text-lg text-gray-900">SafeSpace</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-black px-3 py-2 font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black px-3 py-2 font-medium">
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/journal" className="text-gray-700 hover:text-black px-3 py-2 font-medium">
                  My Journal
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-black px-3 py-2 font-medium">
                  Profile
                </Link>
                <button className="text-gray-700 hover:text-black px-3 py-2 font-medium">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-black px-3 py-2 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-full font-medium shadow-sm"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Shadow line for immersive visual separation */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
              Home
            </Link>
            <Link href="/about" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/journal" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                  My Journal
                </Link>
                <Link href="/profile" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <button className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                  Sign In
                </Link>
                <Link href="/auth/register" className="block pl-3 pr-4 py-2 text-base font-medium bg-gray-100 text-black">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}