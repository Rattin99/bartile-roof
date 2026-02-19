import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useRouter } from 'next/navigation';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Eye, Mail, Phone, MapPin, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  reviewed: 'bg-blue-500/20 text-blue-400',
  quoted: 'bg-purple-500/20 text-purple-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400'
};

export default function AdminQuotes() {
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

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
      router.push('/login');
    }
  };

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.QuoteRequest.list();
      // Sort in memory as list() arg support depends on API implementation
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
        setSelectedQuote(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const filteredQuotes = filterStatus === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === filterStatus);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
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
                <p className="text-sm text-white/40">View and manage customer quote requests</p>
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading quote requests...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-12 text-white/50">No quote requests found</div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
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
                        <Badge className={STATUS_COLORS[quote.status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400'}>
                          {quote.status}
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
                          {quote.created_at && format(new Date(quote.created_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(quote);
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-4 h-4" />
                    {quote.project_address || 'No address provided'}
                  </div>
                  {quote.configuration_snapshot && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-white/40 text-xs mb-2">Configuration:</p>
                      <div className="flex flex-wrap gap-2">
                         {/* Parsing JSON snapshot safely */}
                         {quote.configuration_snapshot.profile && (
                             <Badge variant="outline">{quote.configuration_snapshot.profile.name}</Badge>
                         )}
                         {quote.configuration_snapshot.color && (
                             <Badge variant="outline">{quote.configuration_snapshot.color.name}</Badge>
                         )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Quote Request Details</DialogTitle>
              {selectedQuote && (
                <Select 
                    value={selectedQuote.status} 
                    onValueChange={(value) => handleStatusUpdate(selectedQuote.id, value)}
                >
                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                </Select>
              )}
            </div>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-white/40 mb-3">Customer Information</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs text-white/40">Name</p>
                    <p className="text-white">{selectedQuote.contact_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Email</p>
                    <p className="text-white">{selectedQuote.contact_email}</p>
                  </div>
                  {selectedQuote.contact_phone && (
                    <div>
                      <p className="text-xs text-white/40">Phone</p>
                      <p className="text-white">{selectedQuote.contact_phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-white/40">Project Address</p>
                    <p className="text-white">{selectedQuote.project_address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Estimated Squares</p>
                    <p className="text-white">{selectedQuote.estimated_squares || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Submitted</p>
                    <p className="text-white">{selectedQuote.created_at && format(new Date(selectedQuote.created_at), 'PPpp')}</p>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              {selectedQuote.configuration_snapshot && (
                <div>
                  <h3 className="text-sm font-medium text-white/40 mb-3">Configuration Snapshot</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <pre className="text-xs text-white whitespace-pre-wrap font-mono">
                        {JSON.stringify(selectedQuote.configuration_snapshot, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* File */}
              {selectedQuote.plan_file_path && (
                <div>
                  <h3 className="text-sm font-medium text-white/40 mb-3">Uploaded Plan</h3>
                  <a
                    href={selectedQuote.plan_file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-[#c9a962]" />
                    <span className="text-white">View Uploaded Plan</span>
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