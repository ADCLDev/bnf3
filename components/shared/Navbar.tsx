// src/components/shared/Navbar.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, ChevronDown } from 'lucide-react';
import CartPopup from '../reuseable/CartPopUp';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/components/providers/AuthProvider';

interface NavbarProps {
  hideAuthButtons?: boolean;
}

export default function Navbar({ hideAuthButtons = false }: NavbarProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('Navbar State:', {
      isAuthenticated: !!user,
      email: user?.email,
      profile: userProfile,
      loading
    });
  }, [user, userProfile, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    router.push('/welcome');
  };

  const handleGetStarted = () => {
    console.log('Navigating to login');
    router.push('/login');
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="border-b relative z-50 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={40}
              style={{ height: 'auto' }}
              className="w-[100px] md:w-[150px] h-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link href="/services" className="hover:text-red-500 transition-colors">
              Services
            </Link>
            <Link href="/faqs" className="hover:text-red-500 transition-colors">
              FAQs
            </Link>
          </nav>

          {/* Right Side Items */}
          {!hideAuthButtons && (
            <div className="flex items-center space-x-4">
              <CartPopup />

              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center space-x-2">
                    {/* Profile Icon - Clickable */}
                    <button
                      onClick={handleProfileClick}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    {/* Dropdown Arrow - Separate */}
                    <button
                      onClick={toggleDropdown}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      
                      {userProfile?.is_admin && (
                        <Link
                          href="/admin-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
