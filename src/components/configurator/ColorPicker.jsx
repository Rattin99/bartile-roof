import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const COLORS = [
  { id: '33', name: 'Charcoal', hex: '#3d3d3d', category: 'Dark' },
  { id: '35', name: 'Slate Gray', hex: '#5a5a5a', category: 'Dark' },
  { id: '162', name: 'Storm', hex: '#4a4f54', category: 'Dark' },
  { id: '202', name: 'Weathered Bronze', hex: '#6b5b4f', category: 'Brown' },
  { id: '415', name: 'Desert Sand', hex: '#c4a882', category: 'Tan' },
  { id: '613', name: 'Terracotta', hex: '#b35c3a', category: 'Red' },
  { id: '629', name: 'Autumn Rust', hex: '#8b4513', category: 'Red' },
  { id: '695', name: 'Forest Green', hex: '#4a5d4a', category: 'Green' },
  { id: '720', name: 'Ocean Blue', hex: '#4a5a6b', category: 'Blue' },
  { id: '801', name: 'Vintage Brown', hex: '#5d4e42', category: 'Brown' },
  { id: '855', name: 'Adobe Clay', hex: '#8b6b5a', category: 'Brown' },
  { id: '902', name: 'Midnight Black', hex: '#1a1a1a', category: 'Dark' },
  { id: '945', name: 'Pewter', hex: '#8a8a8a', category: 'Gray' },
  { id: '978', name: 'Silver Mist', hex: '#9ca3af', category: 'Gray' },
  { id: '1001', name: 'Sandstone', hex: '#d4c4a8', category: 'Tan' },
  { id: '1045', name: 'Burnt Sienna', hex: '#a0522d', category: 'Red' },
  { id: '1102', name: 'Sage', hex: '#7d8471', category: 'Green' },
  { id: '1156', name: 'Copper', hex: '#b87333', category: 'Brown' },
  { id: '1203', name: 'Natural Clay', hex: '#c9b896', category: 'Tan' },
  { id: '1287', name: 'Deep Walnut', hex: '#4a3728', category: 'Brown' },
];

const categories = ['All', 'Dark', 'Gray', 'Brown', 'Tan', 'Red', 'Green', 'Blue'];

export default function ColorPicker({ config, updateConfig }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColors = COLORS.filter(color => {
    const matchesCategory = activeCategory === 'All' || color.category === activeCategory;
    const matchesSearch = color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         color.id.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-light mb-2">Choose Your Color</h2>
        <p className="text-white/50 text-sm sm:text-base">
          Over 700 colors available. Select the perfect shade for your roof.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          type="text"
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-[#c9a962] focus:border-[#c9a962]"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === cat
                ? 'bg-white text-[#0f0f0f]'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {filteredColors.map((color, index) => {
          const isSelected = config.color?.id === color.id;
          
          return (
            <motion.button
              key={color.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => updateConfig('color', color)}
              className="group relative"
            >
              <div 
                className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-[#c9a962] ring-offset-2 ring-offset-[#0f0f0f] scale-95' 
                    : 'hover:scale-95'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {/* Texture Overlay */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />
                
                {/* Selection Check */}
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#c9a962] flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#0f0f0f]" />
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-white/80 truncate">{color.name}</p>
                <p className="text-[10px] text-white/40">#{color.id}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Color Info */}
      {config.color && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg"
              style={{ backgroundColor: config.color.hex }}
            />
            <div>
              <p className="text-white font-medium">{config.color.name}</p>
              <p className="text-white/50 text-sm">Color Code: #{config.color.id}</p>
              <p className="text-white/40 text-xs mt-1">Category: {config.color.category}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}