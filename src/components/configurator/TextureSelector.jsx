'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TextureSelector({ config, updateConfig }) {
  const [textures, setTextures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTextures() {
      try {
        const data = await base44.entities.TileTexture.list('sort_order');
        setTextures(data);
      } catch (error) {
        console.error('Failed to fetch textures:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTextures();
  }, []);

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
        <h2 className="text-2xl sm:text-3xl font-light mb-2">Select Texture</h2>
        <p className="text-white/50 text-sm sm:text-base">
          Add character and depth to your tiles with hand-crafted textures
        </p>
      </div>

      {/* Premium Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#c9a962]/10 border border-[#c9a962]/20 mb-6">
        <Info className="w-5 h-5 text-[#c9a962] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-white/80">
            Premium textures may have additional charges. Contact our experts for pricing details.
          </p>
        </div>
      </div>

      {/* Texture Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {textures.map((texture, index) => {
          const isSelected = config.texture?.id === texture.id;
          const isPremium = texture.name !== 'Smooth/Standard';
          
          return (
            <motion.button
              key={texture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => updateConfig('texture', texture)}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 text-left ${
                isSelected 
                  ? 'ring-2 ring-[#c9a962] bg-white/10' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Image */}
              <div className="relative h-32 overflow-hidden bg-white/5">
                <img 
                  src={texture.thumbnail_asset_path || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'} 
                  alt={texture.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
                
                {/* Premium Badge */}
                {isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-[#c9a962]/20 text-[#c9a962] font-medium">
                      Premium
                    </span>
                  </div>
                )}

                {/* Selection Check */}
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 left-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#c9a962] flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#0f0f0f]" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{texture.name}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-white/40" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Hand-applied finish for authentic look</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-white/50 line-clamp-2">
                  Customized {texture.name.toLowerCase()} texture to enhance your roof profile.
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}