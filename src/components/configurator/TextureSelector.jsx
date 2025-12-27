import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TEXTURES = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Straight factory-finished look with no added options.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    premium: false
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Hand spackled with select colors to simulate moss and lichen growth for an attention-grabbing aged look.',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&q=80',
    premium: true,
    note: '70% of tiles will simulate moss and lichen growth'
  },
  {
    id: 'swirl-brush',
    name: 'Swirl Brush',
    description: 'Hand brushed with a swirl motion giving each tile a slightly different look from the next.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
    premium: true
  },
  {
    id: 'straight-brush',
    name: 'Straight Brush',
    description: 'Straight brushed option gives added texture to any style for a refined finish.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
    premium: true
  },
  {
    id: 'cobblestone',
    name: 'Cobblestone',
    description: 'Dimpled texture that accurately replicates the real look of quarried stone.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
    premium: true
  },
  {
    id: 'signature-slate',
    name: 'Signature Slate',
    description: 'Removes the divider line in the center of Legendary Slate for a true wide-slate look.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    premium: true
  }
];

export default function TextureSelector({ config, updateConfig }) {
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
        {TEXTURES.map((texture, index) => {
          const isSelected = config.texture?.id === texture.id;
          
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
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={texture.image} 
                  alt={texture.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
                
                {/* Premium Badge */}
                {texture.premium && (
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
                  {texture.note && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-white/40" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{texture.note}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-xs text-white/50 line-clamp-2">
                  {texture.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}