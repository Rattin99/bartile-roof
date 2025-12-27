import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EDGE_OPTIONS = [
  { id: 'standard', name: 'Standard', description: 'Straight factory-finished look' },
  { id: 'rusticut', name: 'Rusticut', description: 'Serrated edge cut for a more rustic finish' },
  { id: 'toscana', name: 'Toscana', description: 'Unique beveling creates a staggered look' }
];

const WEIGHT_OPTIONS = [
  { id: 'standard', name: 'Standard', description: '10.4 lbs/sq.ft. - Perfect for easy installation' },
  { id: 'ultralite', name: 'Ultralite', description: '8.9 lbs/sq.ft. - Perfect for re-roofing' },
  { id: 'super-duty', name: 'Super Duty', description: '11.6 lbs/sq.ft. - For extreme weather climates' }
];

const LAYOUT_OPTIONS = [
  { id: 'standard', name: 'Standard', description: 'Straight factory-finished look' },
  { id: 'cottage', name: 'Cottage', description: 'Variable staggering for unparalleled texture' }
];

const TRIM_OPTIONS = {
  gable: [
    { id: '90-tile-rakes', name: '90° Tile Rakes', description: 'Clean traditional tile look - L shaped' },
    { id: 'oval-tile-rakes', name: 'Oval Tile Rakes', description: 'Mediterranean rounded C shape' },
    { id: 'metal-rakes', name: 'Metal Rakes', description: 'True shake or slate look' }
  ],
  hip: [
    { id: '45-hip', name: '45° Hip', description: 'Traditional shake or slate look' },
    { id: 'oval-hip', name: 'Oval Hip', description: 'Spanish or Mediterranean look' },
    { id: 'hip-starter', name: 'Hip Starter', description: 'First tile on hip run for slate/shake' },
    { id: 'oval-hip-starter', name: 'Oval Hip Starter', description: 'First tile for Mission/European' }
  ],
  ridge: [
    { id: '45-ridge', name: '45° Ridge', description: 'Slate/shake look for 3/12 to 10/12 pitch' },
    { id: 'oval-ridge', name: 'Oval Ridge', description: 'Mission and Mediterranean look' },
    { id: 'steep-ridge', name: 'Steep Ridge', description: 'For above 11/12 pitch' },
    { id: 'bell-ridge', name: 'Bell Ridge', description: 'Unique English coping tile look' }
  ]
};

function OptionGroup({ title, options, selectedId, onChange }) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
              isSelected 
                ? 'bg-white/10 ring-1 ring-[#c9a962]' 
                : 'bg-white/5 hover:bg-white/8'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white text-sm">{option.name}</h4>
                <p className="text-xs text-white/50 mt-0.5">{option.description}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#c9a962] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#0f0f0f]" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function OptionSelector({ config, updateConfig }) {
  const updateTrim = (type, value) => {
    updateConfig('trim', { ...config.trim, [type]: value });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-light mb-2">Additional Options</h2>
        <p className="text-white/50 text-sm sm:text-base">
          Customize edge designs, weight, and trim details
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="edge" className="space-y-3">
        {/* Edge Design */}
        <AccordionItem value="edge" className="border-0">
          <AccordionTrigger className="bg-white/5 rounded-xl px-5 py-4 hover:bg-white/8 hover:no-underline [&[data-state=open]]:rounded-b-none">
            <div className="flex items-center justify-between flex-1 pr-4">
              <div className="text-left">
                <h3 className="font-medium text-white">Edge Design</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  {EDGE_OPTIONS.find(o => o.id === config.edge)?.name || 'Select'}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white/5 rounded-b-xl px-5 pb-4 pt-2">
            <OptionGroup 
              options={EDGE_OPTIONS} 
              selectedId={config.edge} 
              onChange={(id) => updateConfig('edge', id)} 
            />
          </AccordionContent>
        </AccordionItem>

        {/* Weight Options */}
        <AccordionItem value="weight" className="border-0">
          <AccordionTrigger className="bg-white/5 rounded-xl px-5 py-4 hover:bg-white/8 hover:no-underline [&[data-state=open]]:rounded-b-none">
            <div className="flex items-center justify-between flex-1 pr-4">
              <div className="text-left">
                <h3 className="font-medium text-white">Weight Options</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  {WEIGHT_OPTIONS.find(o => o.id === config.weight)?.name || 'Select'}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white/5 rounded-b-xl px-5 pb-4 pt-2">
            <OptionGroup 
              options={WEIGHT_OPTIONS} 
              selectedId={config.weight} 
              onChange={(id) => updateConfig('weight', id)} 
            />
          </AccordionContent>
        </AccordionItem>

        {/* Layout Options */}
        <AccordionItem value="layout" className="border-0">
          <AccordionTrigger className="bg-white/5 rounded-xl px-5 py-4 hover:bg-white/8 hover:no-underline [&[data-state=open]]:rounded-b-none">
            <div className="flex items-center justify-between flex-1 pr-4">
              <div className="text-left">
                <h3 className="font-medium text-white">Layout Options</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  {LAYOUT_OPTIONS.find(o => o.id === config.layout)?.name || 'Select'}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white/5 rounded-b-xl px-5 pb-4 pt-2">
            <OptionGroup 
              options={LAYOUT_OPTIONS} 
              selectedId={config.layout} 
              onChange={(id) => updateConfig('layout', id)} 
            />
          </AccordionContent>
        </AccordionItem>

        {/* Trim Options */}
        <AccordionItem value="trim" className="border-0">
          <AccordionTrigger className="bg-white/5 rounded-xl px-5 py-4 hover:bg-white/8 hover:no-underline [&[data-state=open]]:rounded-b-none">
            <div className="flex items-center justify-between flex-1 pr-4">
              <div className="text-left">
                <h3 className="font-medium text-white">Trim Options</h3>
                <p className="text-xs text-white/50 mt-0.5">Gable, Hip & Ridge Details</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white/5 rounded-b-xl px-5 pb-4 pt-2 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Gable Options</h4>
              <OptionGroup 
                options={TRIM_OPTIONS.gable} 
                selectedId={config.trim.gable} 
                onChange={(id) => updateTrim('gable', id)} 
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Hip Options</h4>
              <OptionGroup 
                options={TRIM_OPTIONS.hip} 
                selectedId={config.trim.hip} 
                onChange={(id) => updateTrim('hip', id)} 
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Ridge Options</h4>
              <OptionGroup 
                options={TRIM_OPTIONS.ridge} 
                selectedId={config.trim.ridge} 
                onChange={(id) => updateTrim('ridge', id)} 
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}