'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProfileSelector({ config, updateConfig }) {
  const [profiles, setProfiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const data = await base44.entities.TileProfile.list('sort_order');
        const activeProfiles = data.filter(p => p.is_active);
        setProfiles(activeProfiles);
        
        // Extract unique categories from the database field
        const cats = [...new Set(activeProfiles.map(p => p.category || 'Other'))];
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const filteredProfiles = activeCategory === 'all' 
    ? profiles 
    : profiles.filter(p => {
        const cat = p.category || 'Other';
        return cat === activeCategory;
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
        <h2 className="text-2xl sm:text-3xl font-light mb-2">Select Your Profile</h2>
        <p className="text-white/50 text-sm sm:text-base">
          Choose the tile style that best complements your home&apos;s architecture
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            activeCategory === 'all'
              ? 'bg-white text-[#0f0f0f]'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          All Profiles
        </button>
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

      {/* Profile Grid */}
      <div className="space-y-3">
        {filteredProfiles.map((profile, index) => {
          const isSelected = config.profile?.id === profile.id;
          const category = profile.category || 'Standard';
          
          return (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => updateConfig('profile', profile)}
              className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-[#c9a962] bg-white/10' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-stretch">
                {/* Image */}
                <div className="w-28 sm:w-36 h-28 sm:h-32 flex-shrink-0 overflow-hidden bg-white/5">
                  <img 
                    src={profile.icon_asset_path || profile.image_url || '/tiles/legendary.jpeg'} 
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 text-left">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-white">
                        {category}
                      </span>
                      <h3 className="text-base sm:text-lg font-medium text-white">
                        {profile.name}
                      </h3>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#c9a962] flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-[#0f0f0f]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-white/50 line-clamp-2 mb-3">
                    {profile.description || 'Premium concrete roof tile providing elegance and durability.'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60">
                      75-Year Warranty
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60">
                      Class A Fire Rating
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}