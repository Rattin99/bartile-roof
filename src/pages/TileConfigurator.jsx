import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, RotateCcw, Send, Menu, X, Check, Info, ChevronDown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import ProfileSelector from '@/components/configurator/ProfileSelector';
import ColorPicker from '@/components/configurator/ColorPicker';
import TextureSelector from '@/components/configurator/TextureSelector';
import OptionSelector from '@/components/configurator/OptionSelector';
import PreviewPanel from '@/components/configurator/PreviewPanel';
import QuoteModal from '@/components/configurator/QuoteModal';
import ConfigSummary from '@/components/configurator/ConfigSummary';

const STEPS = [
  { id: 'profile', label: 'Profile', icon: '01' },
  { id: 'color', label: 'Color', icon: '02' },
  { id: 'texture', label: 'Texture', icon: '03' },
  { id: 'options', label: 'Options', icon: '04' },
  { id: 'summary', label: 'Summary', icon: '05' },
];

export default function TileConfigurator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState({
    profile: null,
    color: null,
    texture: null,
    edge: 'standard',
    weight: 'standard',
    layout: 'standard',
    trim: {
      gable: '90-tile-rakes',
      hip: '45-hip',
      ridge: '45-ridge'
    }
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      setIsAdmin(user.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.profile !== null;
      case 1: return config.color !== null;
      case 2: return config.texture !== null;
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetConfig = () => {
    setConfig({
      profile: null,
      color: null,
      texture: null,
      edge: 'standard',
      weight: 'standard',
      layout: 'standard',
      trim: {
        gable: '90-tile-rakes',
        hip: '45-hip',
        ridge: '45-ridge'
      }
    });
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProfileSelector config={config} updateConfig={updateConfig} />;
      case 1:
        return <ColorPicker config={config} updateConfig={updateConfig} />;
      case 2:
        return <TextureSelector config={config} updateConfig={updateConfig} />;
      case 3:
        return <OptionSelector config={config} updateConfig={updateConfig} />;
      case 4:
        return <ConfigSummary config={config} onRequestQuote={() => setShowQuoteModal(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded flex items-center justify-center">
                <span className="text-[#0f0f0f] font-bold text-sm sm:text-lg">B</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight">BARTILE</h1>
                <p className="text-[10px] sm:text-xs text-white/40 tracking-[0.2em] uppercase">Premium Roof Tiles</p>
              </div>
            </div>

            {/* Desktop Progress */}
            <div className="hidden lg:flex items-center gap-1">
              {STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-white text-[#0f0f0f]' 
                      : index < currentStep 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : 'text-white/30 cursor-not-allowed'
                  }`}
                  disabled={index > currentStep}
                >
                  <span className="text-xs font-medium">{step.icon}</span>
                  <span className="text-sm font-medium">{step.label}</span>
                  {index < currentStep && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg bg-white/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isAdmin && (
                <Button
                  onClick={() => navigate(createPageUrl('Admin'))}
                  variant="ghost"
                  className="text-white/60 hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <button 
                onClick={resetConfig}
                className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">Reset</span>
              </button>
              <Button 
                onClick={() => setShowQuoteModal(true)}
                className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f] font-medium px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                Get Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60">Step {currentStep + 1} of {STEPS.length}</span>
            <span className="text-xs font-medium">{STEPS[currentStep].label}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#c9a962]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-lg lg:hidden pt-32"
          >
            <div className="px-6 py-8">
              <div className="space-y-2 mb-8">
                {STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (index <= currentStep) {
                        setCurrentStep(index);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      index === currentStep 
                        ? 'bg-white text-[#0f0f0f]' 
                        : index < currentStep 
                          ? 'bg-white/10 text-white' 
                          : 'bg-white/5 text-white/30'
                    }`}
                    disabled={index > currentStep}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-light">{step.icon}</span>
                      <span className="font-medium">{step.label}</span>
                    </div>
                    {index < currentStep && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    resetConfig();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 text-white/60"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Configuration</span>
                </button>
                <Button 
                  onClick={() => {
                    setShowQuoteModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f] font-medium p-4 h-auto"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Request Quote
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-28 sm:pt-24 lg:pt-20 min-h-screen flex flex-col lg:flex-row">
        {/* Preview Panel - Takes more space on desktop */}
        <div className="lg:flex-1 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] order-1 lg:order-2">
          <PreviewPanel config={config} />
        </div>

        {/* Configuration Panel */}
        <div className="w-full lg:w-[520px] xl:w-[580px] flex-shrink-0 order-2 lg:order-1">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <button
                onClick={prevStep}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === 0 
                    ? 'text-white/20 cursor-not-allowed' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                disabled={currentStep === 0}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back</span>
              </button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    canProceed()
                      ? 'bg-white text-[#0f0f0f] hover:bg-white/90'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowQuoteModal(true)}
                  className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f] font-medium px-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Request Quote
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal 
        open={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)}
        config={config}
      />
    </div>
  );
}