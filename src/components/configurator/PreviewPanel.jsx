import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ZoomIn, ZoomOut, RotateCw, Home, Box, Image as ImageIcon } from 'lucide-react';
import TileViewer3D from './TileViewer3D';

const HOUSE_IMAGES = [
  {
    id: 'modern',
    name: 'Modern Estate',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'
  },
  {
    id: 'traditional',
    name: 'Traditional',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'
  },
  {
    id: 'craftsman',
    name: 'Craftsman',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'
  }
];

export default function PreviewPanel({ config }) {
  const [activeHouse, setActiveHouse] = useState(HOUSE_IMAGES[0]);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('house'); // 'house' or '3d'

  const getOverlayColor = () => {
    if (!config.color) return 'rgba(74, 74, 74, 0.4)';
    return `${config.color.hex}80`;
  };

  return (
    <div className="h-[50vh] lg:h-full flex flex-col bg-[#0a0a0a]">
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-4 z-30 flex gap-2">
        <button
          onClick={() => setViewMode('house')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm transition-all ${
            viewMode === 'house'
              ? 'bg-[#c9a962]/20 text-[#c9a962] ring-1 ring-[#c9a962]/30'
              : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-sm font-medium">House</span>
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm transition-all ${
            viewMode === '3d'
              ? 'bg-[#c9a962]/20 text-[#c9a962] ring-1 ring-[#c9a962]/30'
              : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
          }`}
        >
          <Box className="w-4 h-4" />
          <span className="text-sm font-medium">3D Tile</span>
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'house' ? (
            <motion.div
              key="house"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{ scale: zoom }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <img 
                  src={activeHouse.url}
                  alt={activeHouse.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Color Overlay on Roof Area - Simulated */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: config.color ? 0.5 : 0 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, ${getOverlayColor()} 0%, transparent 60%)`,
                    mixBlendMode: 'multiply'
                  }}
                />
              </motion.div>

              {/* Zoom Controls - Only for house view */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
                  className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(prev => Math.max(prev - 0.2, 1))}
                  className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Empty State - House View */}
              {!config.profile && !config.color && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <Home className="w-8 h-8 text-white/40" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-2">Design Your Dream Roof</h3>
                    <p className="text-white/50 text-sm max-w-xs mx-auto">
                      Select a tile profile and color to see a preview of your custom roof
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <TileViewer3D config={config} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Configuration Badge - Only in house view */}
        {viewMode === 'house' && (
          <AnimatePresence>
            {(config.profile || config.color) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 sm:bottom-6"
              >
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10">
                  <div className="flex items-center gap-4">
                    {config.color && (
                      <div 
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: config.color.hex }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {config.profile?.name || 'Select a profile'}
                      </p>
                      <p className="text-white/50 text-sm truncate">
                        {config.color ? `${config.color.name} (#${config.color.id})` : 'No color selected'}
                      </p>
                      {config.texture && (
                        <p className="text-[#c9a962] text-xs mt-1">
                          {config.texture.name} Texture
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* House Selector - Only show in house view */}
      {viewMode === 'house' && (
        <div className="bg-[#0f0f0f] border-t border-white/5 p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs text-white/40 whitespace-nowrap mr-2">Preview on:</span>
            {HOUSE_IMAGES.map((house) => (
              <button
                key={house.id}
                onClick={() => setActiveHouse(house)}
                className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all ${
                  activeHouse.id === house.id 
                    ? 'ring-2 ring-[#c9a962]' 
                    : 'ring-1 ring-white/10 hover:ring-white/30'
                }`}
              >
                <img 
                  src={house.url} 
                  alt={house.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}