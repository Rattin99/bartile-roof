import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from '@/api/base44Client';

export default function QuoteModal({ open, onClose, config }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload file if present
      let fileUrl = null;
      if (uploadedFile) {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput?.files[0]) {
          const uploadResult = await base44.integrations.Core.UploadFile({ file: fileInput.files[0] });
          fileUrl = uploadResult.file_url;
        }
      }

      // Save quote request
      await base44.entities.QuoteRequest.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        comments: formData.comments,
        configuration: config,
        file_url: fileUrl,
        status: 'pending'
      });
      
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to submit quote:', error);
      alert('Failed to submit quote request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      comments: ''
    });
    setUploadedFile(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#141414] rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#141414] border-b border-white/5 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-medium text-white">Request a Quote</h2>
                <p className="text-sm text-white/50 mt-1">
                  Get pricing for your custom configuration
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              /* Success State */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-light text-white mb-3">Quote Request Sent!</h3>
                <p className="text-white/50 mb-8">
                  Thank you for your interest in Bartile. Our team will contact you within 24-48 hours with a detailed quote.
                </p>
                <Button
                  onClick={resetForm}
                  className="bg-white text-[#0f0f0f] hover:bg-white/90 px-8"
                >
                  Close
                </Button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Configuration Summary */}
                {config.profile && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Your Configuration</p>
                    <div className="flex items-center gap-3">
                      {config.color && (
                        <div 
                          className="w-10 h-10 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: config.color.hex }}
                        />
                      )}
                      <div>
                        <p className="text-white font-medium">{config.profile?.name}</p>
                        <p className="text-white/50 text-sm">
                          {config.color?.name} • {config.texture?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Full Name *</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Smith"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-[#c9a962] focus:border-[#c9a962]"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Email Address *</Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-[#c9a962] focus:border-[#c9a962]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Phone Number</Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-[#c9a962] focus:border-[#c9a962]"
                  />
                </div>

                {/* Address */}
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Project Address *</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="123 Main St, City, State ZIP"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-[#c9a962] focus:border-[#c9a962]"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">
                    Upload Eagle View / Aerial View (Optional)
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`p-4 rounded-xl border-2 border-dashed transition-all ${
                      uploadedFile 
                        ? 'border-[#c9a962] bg-[#c9a962]/5' 
                        : 'border-white/10 hover:border-white/20'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          uploadedFile ? 'bg-[#c9a962]/20' : 'bg-white/5'
                        }`}>
                          <Upload className={`w-5 h-5 ${uploadedFile ? 'text-[#c9a962]' : 'text-white/40'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${uploadedFile ? 'text-[#c9a962]' : 'text-white/60'}`}>
                            {uploadedFile || 'Click to upload file'}
                          </p>
                          <p className="text-xs text-white/30">PDF, JPG, PNG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Additional Comments</Label>
                  <Textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Tell us more about your project..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-[#c9a962] focus:border-[#c9a962] resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f] font-medium rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Quote Request
                    </>
                  )}
                </Button>

                {/* Privacy Note */}
                <p className="text-xs text-white/30 text-center">
                  By submitting this form, you agree to our Terms & Conditions and Privacy Policy
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}