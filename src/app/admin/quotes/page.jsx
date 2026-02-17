'use client';

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const STATUS_COLORS = {
  NEW: 'bg-yellow-500/20 text-yellow-400',
  PROCESSING: 'bg-blue-500/20 text-blue-400',
  QUOTED: 'bg-purple-500/20 text-purple-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
  ARCHIVED: 'bg-red-500/20 text-red-400'
};

export default function AdminQuotes() {
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    checkAuth();
    loadQuotes();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await base44.auth.me();
      if (user.role !== 'admin') {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  };

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.QuoteRequest.list();
      // Mock sorting since API might not support it yet
      const sorted = (data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setQuotes(sorted);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (quote) => {
    setSelectedQuote(quote);
    setShowDialog(true);
  };

  const handleStatusUpdate = async (quoteId, newStatus) => {
    try {
      await base44.entities.QuoteRequest.update(quoteId, { status: newStatus });
      loadQuotes();
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin')}
                className="text-white/60 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Quote Requests</h1>
                <p className="text-sm text-white/40">Manage leads</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading quote requests...</div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12 text-white/50">No quote requests found</div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card
                key={quote.id}
                className="bg-white/5 border-white/10 hover:bg-white/8 transition-all cursor-pointer"
                onClick={() => handleView(quote)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-white text-lg">{quote.contact_name}</CardTitle>
                        <Badge className={STATUS_COLORS[quote.status || 'NEW']}>
                          {quote.status || 'NEW'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                          <Mail className="w-4 h-4" />
                          {quote.contact_email}
                        </div>
                        {quote.contact_phone && (
                          <div className="flex items-center gap-2 text-white/60">
                            <Phone className="w-4 h-4" />
                            {quote.contact_phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="w-4 h-4" />
                          {quote.created_at ? format(new Date(quote.created_at), 'MMM d, yyyy') : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white/60">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10 max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Quote Request Details</DialogTitle>
              <Select 
                value={selectedQuote?.status || 'NEW'} 
                onValueChange={(value) => handleStatusUpdate(selectedQuote.id, value)}
              >
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="QUOTED">Quoted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-sm font-medium text-white/40 mb-3">Customer Information</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <p className="text-white">{selectedQuote.contact_name}</p>
                  <p className="text-white">{selectedQuote.contact_email}</p>
                  <p className="text-white">{selectedQuote.contact_phone}</p>
                  <p className="text-white">{selectedQuote.project_address}</p>
                </div>
              </div>

              {selectedQuote.configuration_snapshot && (
                <div>
                   <h3 className="text-sm font-medium text-white/40 mb-3">Configuration</h3>
                   <pre className="bg-white/5 p-4 rounded-xl text-xs overflow-auto">
                       {JSON.stringify(selectedQuote.configuration_snapshot, null, 2)}
                   </pre>
                </div>
              )}

              {selectedQuote.plan_file_path && (
                <div>
                  <h3 className="text-sm font-medium text-white/40 mb-3">Uploaded File</h3>
                  <a
                    href={selectedQuote.plan_file_path}
                    target="_blank"
                    className="flex items-center gap-2 bg-white/5 rounded-xl p-4 hover:bg-white/10"
                  >
                    <FileText className="w-5 h-5 text-[#c9a962]" />
                    <span className="text-white">View File</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-white/40" />
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
