// src/app/(root)/contributors-panel/[id]/page.tsx
import React from 'react';
import { Building2, MapPin, Download, Users, Star, BarChart3, Calendar, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
const ContributorProfile = () => {
  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      {/* Red Banner */}
      <div className="bg-red-500 h-32 w-full relative">
      <div className="absolute -bottom-16 left-8">
      <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative">
        <Image
          src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg"
          alt="Profile"
          fill
          className="object-cover"
          priority
          sizes="128px"
          quality={90}
        />
      </div>
    </div>
      </div>

      {/* Profile Content */}
      <div className="mt-20 px-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Demo Designer</h1>
        <p className="text-gray-600 mt-1">designer@bengalfonts.com</p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Published Fonts</CardTitle>
              <Download className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">1</div>
              <p className="text-xs text-gray-500">Active fonts in marketplace</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Downloads</CardTitle>
              <Users className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">0</div>
              <p className="text-xs text-gray-500">Across all fonts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Avg. Rating</CardTitle>
              <Star className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">4.8</div>
              <p className="text-xs text-gray-500">Based on user reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
              <BarChart3 className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">৳0</div>
              <p className="text-xs text-gray-500">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Professional Info & About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">Bengal Fonts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Latest Release</p>
                  <p className="font-medium">Oct 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Gift className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">September 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Thouhedul Islam Himel, the Managing Director and a distinguished Type Designer at Bengal Fonts, is renowned for his innovative contributions to Bengali typography. Combining his expertise in type design with visionary leadership, Himel has been instrumental in shaping Bengal Fonts mission to create culturally rich and aesthetically refined typefaces. His passion for blending traditional elements with modern design principles not only drives the company&apos;s creative direction but also influences the broader landscape of Bengali type design.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Font Categories */}
        <div className="mt-12">
          <h2 className="text-lg font-bold mb-6">Retro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="bg-red-900 h-48 flex items-center justify-center">
              <Image
                src="https://img.freepik.com/free-psd/digital-marketing-agency-corporate-web-banner-template_120329-3228.jpg"
                alt="Mridul Retro"
                width={800}  // Adjust this to your desired width
                height={400} // Adjust this to your desired height
                className="w-full h-full object-cover"
                loading="lazy"
                quality={75} // Adjust quality as needed (default is 75)
                />
                
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">Mridul Retro</h3>
                <p className="text-sm text-gray-600 mt-1">English</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-semibold">৳170.00</p>
                  <button className="text-red-500 text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorProfile;