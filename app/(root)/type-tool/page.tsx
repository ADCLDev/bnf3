// app/(root)/type-tool/page.tsx
'use client'
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FAQBanner from '@/components/reuseable/FAQBanner';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Square } from 'lucide-react';

const TypeTool = () => {
  const [text, setText] = useState('Write or paste your text');
  const [fontSize, setFontSize] = useState(48);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [selectedCategory, setSelectedCategory] = useState('cursive');

  const categories = [
    { id: 'cursive', name: 'Cursive' },
    { id: 'round', name: 'Round' },
    { id: 'serif', name: 'Serif' },
    { id: 'display', name: 'Display' },
  ];

  const colorOptions = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000',
    '#808000', '#008000', '#800080', '#008080', '#000080'
  ];

  const sampleFonts = [
    "Font name", "Font name", "Font name",
    "Font name", "Font name", "Font name",
    "Font name", "Font name", "Font name"
  ];

  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-red-500 font-bold">Choose Font</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Credit: 5</span>
            <span className="text-sm text-gray-600">Days: 7</span>
            <Button className="bg-red-500 text-white" variant="default">Upgrade</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <Card className="p-6 bg-gray-100">
            {/* Font Categories */}
            <div className="flex gap-3 mb-6">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "secondary"}
                  className={`rounded-full px-6 ${
                    selectedCategory === category.id 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Font Selection Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {sampleFonts.map((font, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  {font}
                </div>
              ))}
            </div>

            {/* Style Controls */}
            <div className="flex items-center justify-between mb-12">
              <Select defaultValue="regular">
                <SelectTrigger className="w-64 h-12 text-lg">
                  <SelectValue placeholder="Select Style/Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="italic">Italic</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="w-12 h-12">
                  <AlignLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12">
                  <AlignCenter className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12">
                  <AlignRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12">
                  <AlignJustify className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12">
                  <Square className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className=" text-xl w-12 h-12">
                  A
                </Button>
                {/* <div className="flex gap-2">
                  <div className="w-12 h-12 border-2 rounded-md"></div>
                  <div className="w-12 h-12 border-2 rounded-md"></div>
                </div> */}
              </div>
            </div>

            {/* Controls in grid layout */}
            <div className="space-y-12">
              {/* First Row: Font Size and Stroke Control */}
              <div className="grid grid-cols-2 gap-6">
                {/* Font Size */}
                <div>
                  <label className="text-lg font-medium block mb-4">Font Size</label>
                  <Slider 
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={8}
                    max={120}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Stroke/Border Control */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-12 h-12 p-1 border-2"
                          style={{ backgroundColor: strokeColor }}
                        >
                          <span className="sr-only">Pick stroke color</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2">
                        <div className="grid grid-cols-5 gap-2">
                          {colorOptions.map((color) => (
                            <Button
                              key={color}
                              variant="outline"
                              className="w-10 h-10 p-0 rounded-md border-2"
                              style={{ backgroundColor: color }}
                              onClick={() => setStrokeColor(color)}
                            />
                          ))}
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Custom Color</label>
                          <input
                            type="color"
                            value={strokeColor}
                            onChange={(e) => setStrokeColor(e.target.value)}
                            className="w-full h-8"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <label className="text-lg font-medium">Add stroke/border controler</label>
                  </div>
                  <Slider 
                    value={[strokeWidth]}
                    onValueChange={(value) => setStrokeWidth(value[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Second Row: Letter Spacing and Line Height */}
              <div className="grid grid-cols-2 gap-6">
                {/* Letter Spacing */}
                <div>
                  <label className="text-lg font-medium block mb-4">Letter Spacing</label>
                  <Slider 
                    value={[letterSpacing]}
                    onValueChange={(value) => setLetterSpacing(value[0])}
                    min={-20}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Line Height */}
                <div>
                  <label className="text-lg font-medium block mb-4">Line Height</label>
                  <Slider 
                    value={[lineHeight]}
                    onValueChange={(value) => setLineHeight(value[0])}
                    min={1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                className="w-full h-16 rounded-full text-xl font-medium bg-black hover:bg-gray-800 text-white"
              >
                Generate
              </Button>
            </div>
          </Card>

          {/* Right Column - Preview */}
          <Card className="flex items-center justify-center p-6">
            <div
              contentEditable
              className="w-full h-full outline-none"
              style={{
                fontSize: `${fontSize}px`,
                letterSpacing: `${letterSpacing}px`,
                lineHeight: lineHeight,
              }}
              onInput={(e) => setText(e.currentTarget.textContent || '')}
              suppressContentEditableWarning={true}
            >
              {text}
            </div>
          </Card>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Type tool Package</h3>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold">Trial for 1 days</h4>
                <div className="text-sm text-gray-600">
                  <span>Commercial License</span>
                  <span className="mx-2">•</span>
                  <span>Limitless Download</span>
                </div>
              </div>
              <Button variant="outline" size="icon" className="rounded-full">
                +
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Type tool Gift Card</h3>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold">৳ 5,000 Starting</h4>
                <div className="text-sm text-gray-600">
                  <span>Commercial License</span>
                  <span className="mx-2">•</span>
                  <span>10 Download</span>
                </div>
              </div>
              <Button variant="outline" size="icon" className="rounded-full">
                +
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Redeem Typetool Gift Card</h3>
            <Button variant="outline" size="icon" className="rounded-full ml-auto">
              ✓
            </Button>
          </Card>
        </div>

        {/* History Section */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-bold mb-4">Your Generate history</h2>
          {/* Add history content here */}
        </Card>

        {/* FAQ Section */}
        <FAQBanner/>
      </div>
    </div>
  );
};

export default TypeTool;