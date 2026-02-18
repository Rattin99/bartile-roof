'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['All', 'Dark', 'Gray', 'Brown', 'Tan', 'Red', 'Green', 'Blue'];

export default function ColorPicker({ config, updateConfig }) {
  const [colors, setColors] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColors() {
      try {
        const data = await base44.entities.TileColor.list('sort_order');
        setColors(data);
      } catch (error) {
        console.error('Failed to fetch colors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchColors();
  }, []);

  const filteredColors = colors.filter(color => {
    // Basic category mapping if not present in DB
    const cat = color.name.includes('Charcoal') || color.name.includes('Black') || color.name.includes('Midnight') ? 'Dark' :
                color.name.includes('Gray') || color.name.includes('Slate') || color.name.includes('Pewter') ? 'Gray' :
                color.name.includes('Brown') || color.name.includes('Walnut') || color.name.includes('Bronze') ? 'Brown' :
                color.name.includes('Tan') || color.name.includes('Sand') || color.name.includes('Clay') ? 'Tan' :
                color.name.includes('Red') || color.name.includes('Terracotta') || color.name.includes('Rust') || color.name.includes('Sienna') ? 'Red' :
                color.name.includes('Green') || color.name.includes('Sage') || color.name.includes('Forest') ? 'Green' :
                color.name.includes('Blue') || color.name.includes('Ocean') ? 'Blue' : 'Other';

    const matchesCategory = activeCategory === 'All' || cat === activeCategory;
    const matchesSearch = color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         color.id.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a962]/20 border-t-[#c9a962] rounded-full"></div>
      </div>
    );
  }

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
        {CATEGORIES.map(cat => (
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
                style={{ backgroundColor: color.hex_code }}
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
                <p className="text-[10px] text-white/40">#{color.id.slice(0, 4)}</p>
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
              style={{ backgroundColor: config.color.hex_code }}
            />
            <div>
              <p className="text-white font-medium">{config.color.name}</p>
              <p className="text-white/50 text-sm">Color Code: {config.color.id.slice(0, 8)}</p>
              <p className="text-white/40 text-xs mt-1">{config.color.is_standard ? 'Standard Collection' : 'Premium Color'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}