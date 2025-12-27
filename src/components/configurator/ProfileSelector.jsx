import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

const PROFILES = [
  {
    id: 'legendary-slate',
    name: 'Legendary Slate',
    category: 'Slate',
    description: 'Creates the look and feel of real slate at a fraction of the price. Class A fire rating with 75-year warranty.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    features: ['75-Year Warranty', 'Class A Fire Rating', 'No Battens Required']
  },
  {
    id: 'new-england-slate',
    name: 'New England Slate',
    category: 'Slate',
    description: 'Recreates the look of hand hewn slate with beveled edges and smaller size for a classic aesthetic.',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&q=80',
    features: ['Hand Hewn Look', 'Beveled Edges', 'Turret Tile Option']
  },
  {
    id: 'legendary-split-timber',
    name: 'Legendary Split Timber',
    category: 'Split Timber',
    description: 'The look and feel of wood shake and shingles with superior durability and fire resistance.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
    features: ['Wood Shake Look', '75-Year Warranty', 'Class A Fire Rating']
  },
  {
    id: 'split-timber',
    name: 'Split Timber',
    category: 'Split Timber',
    description: 'Natural appeal of wood recreated in rich rustic style with Class A fire rating.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
    features: ['Rustic Charm', 'Class A Fire Rating', 'Versatile Design']
  },
  {
    id: 'sierra-mission',
    name: 'Sierra Mission',
    category: 'Mission',
    description: 'High barrel design adds texture and richer shadowing for Spanish and Mediterranean styles.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    features: ['High Barrel Design', 'Rich Shadowing', 'Lifetime Durability']
  },
  {
    id: 'european',
    name: 'European',
    category: 'Mediterranean',
    description: 'Smooth double-barrel contour creates distinctive shadows replicating old country tile.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    features: ['Double Barrel', 'Mediterranean Style', 'Distinctive Shadows']
  },
  {
    id: 'yorkshire-slate',
    name: 'Yorkshire Slate',
    category: 'Yorkshire',
    description: 'Rough hand hewn slate look with four different widths for unparalleled texture.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    features: ['Hand Crafted Look', 'Variable Widths', 'Unique Texture']
  },
  {
    id: 'yorkshire-split-timber',
    name: 'Yorkshire Split Timber',
    category: 'Yorkshire',
    description: 'Hand split wood shake look with varied widths and lengths for cottage-style beauty.',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80',
    features: ['Cottage Style', 'Variable Sizes', 'Authentic Texture']
  }
];

const categories = [...new Set(PROFILES.map(p => p.category))];

export default function ProfileSelector({ config, updateConfig }) {
  const [activeCategory, setActiveCategory] = React.useState('all');

  const filteredProfiles = activeCategory === 'all' 
    ? PROFILES 
    : PROFILES.filter(p => p.category === activeCategory);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-light mb-2">Select Your Profile</h2>
        <p className="text-white/50 text-sm sm:text-base">
          Choose the tile style that best complements your home's architecture
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
                <div className="w-28 sm:w-36 h-28 sm:h-32 flex-shrink-0 overflow-hidden">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 text-left">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#c9a962]">
                        {profile.category}
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
                    {profile.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.features.slice(0, 2).map(feature => (
                      <span 
                        key={feature}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60"
                      >
                        {feature}
                      </span>
                    ))}
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