import React from 'react';
import { motion } from 'framer-motion';
import { Check, FileText, Download, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EDGE_LABELS = {
  'standard': 'Standard',
  'rusticut': 'Rusticut',
  'toscana': 'Toscana'
};

const WEIGHT_LABELS = {
  'standard': 'Standard (10.4 lbs/sq.ft.)',
  'ultralite': 'Ultralite (8.9 lbs/sq.ft.)',
  'super-duty': 'Super Duty (11.6 lbs/sq.ft.)'
};

const LAYOUT_LABELS = {
  'standard': 'Standard',
  'cottage': 'Cottage'
};

const TRIM_LABELS = {
  gable: {
    '90-tile-rakes': '90° Tile Rakes',
    'oval-tile-rakes': 'Oval Tile Rakes',
    'metal-rakes': 'Metal Rakes'
  },
  hip: {
    '45-hip': '45° Hip',
    'oval-hip': 'Oval Hip',
    'hip-starter': 'Hip Starter',
    'oval-hip-starter': 'Oval Hip Starter'
  },
  ridge: {
    '45-ridge': '45° Ridge',
    'oval-ridge': 'Oval Ridge',
    'steep-ridge': 'Steep Ridge',
    'bell-ridge': 'Bell Ridge'
  }
};

function SummaryItem({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <span className="text-white/50 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {color && (
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-white font-medium text-sm">{value || '—'}</span>
      </div>
    </div>
  );
}

export default function ConfigSummary({ config, onRequestQuote }) {
  const isComplete = config.profile && config.color && config.texture;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-light mb-2">Configuration Summary</h2>
        <p className="text-white/50 text-sm sm:text-base">
          Review your selections before requesting a quote
        </p>
      </div>

      {/* Completion Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl mb-6 ${
          isComplete 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-[#c9a962]/10 border border-[#c9a962]/20'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isComplete ? 'bg-green-500' : 'bg-[#c9a962]'
          }`}>
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className={`font-medium ${isComplete ? 'text-green-400' : 'text-[#c9a962]'}`}>
              {isComplete ? 'Configuration Complete' : 'Almost There!'}
            </p>
            <p className="text-xs text-white/50">
              {isComplete 
                ? 'Your tile configuration is ready for a quote' 
                : 'Complete all required selections to request a quote'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Card */}
      <div className="bg-white/5 rounded-2xl p-5 sm:p-6 mb-6">
        {/* Main Selections */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">Main Selections</h3>
          <SummaryItem 
            label="Tile Profile" 
            value={config.profile?.name} 
          />
          <SummaryItem 
            label="Color" 
            value={config.color ? `${config.color.name} (#${config.color.id})` : null}
            color={config.color?.hex}
          />
          <SummaryItem 
            label="Texture" 
            value={config.texture?.name} 
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">Options</h3>
          <SummaryItem 
            label="Edge Design" 
            value={EDGE_LABELS[config.edge]} 
          />
          <SummaryItem 
            label="Weight" 
            value={WEIGHT_LABELS[config.weight]} 
          />
          <SummaryItem 
            label="Layout" 
            value={LAYOUT_LABELS[config.layout]} 
          />
        </div>

        {/* Trim Details */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">Trim Details</h3>
          <SummaryItem 
            label="Gable" 
            value={TRIM_LABELS.gable[config.trim.gable]} 
          />
          <SummaryItem 
            label="Hip" 
            value={TRIM_LABELS.hip[config.trim.hip]} 
          />
          <SummaryItem 
            label="Ridge" 
            value={TRIM_LABELS.ridge[config.trim.ridge]} 
          />
        </div>
      </div>

      {/* Color Preview */}
      {config.color && (
        <div className="bg-white/5 rounded-2xl p-5 sm:p-6 mb-6">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4">Selected Color</h3>
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded-xl"
              style={{ backgroundColor: config.color.hex }}
            />
            <div>
              <p className="text-white font-medium text-lg">{config.color.name}</p>
              <p className="text-white/50 text-sm">Color Code: #{config.color.id}</p>
              <p className="text-white/40 text-xs mt-1">{config.color.category} Collection</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onRequestQuote}
          disabled={!isComplete}
          className={`w-full py-6 text-base font-medium rounded-xl transition-all ${
            isComplete 
              ? 'bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]' 
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          <FileText className="w-5 h-5 mr-2" />
          Request Quote
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 py-5 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Save PDF
          </Button>
          <Button
            variant="outline"
            className="flex-1 py-5 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Warranty Badge */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
          <span className="text-[#c9a962] text-sm font-medium">75-Year Warranty</span>
          <span className="text-white/30">•</span>
          <span className="text-white/50 text-sm">Class A Fire Rating</span>
        </div>
      </div>
    </div>
  );
}