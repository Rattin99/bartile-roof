import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
        navigate(createPageUrl('TileConfigurator'));
      }
    } catch {
      base44.auth.redirectToLogin();
    }
  };

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.QuoteRequest.list('-created_date');
      setQuotes(data);
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
                onClick={() => navigate(createPageUrl('Admin'))}
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                        <CardTitle className="text-white text-lg">{quote.name}</CardTitle>
                        <Badge className={STATUS_COLORS[quote.status || 'pending']}>
                          {quote.status || 'pending'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                          <Mail className="w-4 h-4" />
                          {quote.email}
                        </div>
                        {quote.phone && (
                          <div className="flex items-center gap-2 text-white/60">
                            <Phone className="w-4 h-4" />
                            {quote.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(quote.created_date), 'MMM d, yyyy')}
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
                    {quote.address}
                  </div>
                  {quote.configuration && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-white/40 text-xs mb-2">Configuration:</p>
                      <div className="flex flex-wrap gap-2">
                        {quote.configuration.profile && (
                          <Badge variant="outline">{quote.configuration.profile.name}</Badge>
                        )}
                        {quote.configuration.color && (
                          <Badge variant="outline">{quote.configuration.color.name}</Badge>
                        )}
                        {quote.configuration.texture && (
                          <Badge variant="outline">{quote.configuration.texture.name}</Badge>
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
              <Select 
                value={selectedQuote?.status || 'pending'} 
                onValueChange={(value) => handleStatusUpdate(selectedQuote.id, value)}
              >
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
                    <p className="text-white">{selectedQuote.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Email</p>
                    <p className="text-white">{selectedQuote.email}</p>
                  </div>
                  {selectedQuote.phone && (
                    <div>
                      <p className="text-xs text-white/40">Phone</p>
                      <p className="text-white">{selectedQuote.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-white/40">Project Address</p>
                    <p className="text-white">{selectedQuote.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Submitted</p>
                    <p className="text-white">{format(new Date(selectedQuote.created_date), 'PPpp')}</p>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              {selectedQuote.configuration && (
                <div>
                  <h3 className="text-sm font-medium text-white/40 mb-3">Tile Configuration</h3>
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    {selectedQuote.configuration.profile && (
                      <div>
                        <p className="text-xs text-white/40">Tile Profile</p>
                        <p className="text-white">{selectedQuote.configuration.profile.name}</p>
                      </div>
                    )}
                    {selectedQuote.configuration.color && (
                      <div>
                        <p className="text-xs text-white/40">Color</p>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: selectedQuote.configuration.color.hex }}
                          />
                          <p className="text-white">
                            {selectedQuote.configuration.color.name} (#{selectedQuote.configuration.color.id})
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedQuote.configuration.texture && (
                      <div>
                        <p className="text-xs text-white/40">Texture</p>
                        <p className="text-white">{selectedQuote.configuration.texture.name}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <div>
                        <p className="text-xs text-white/40">Edge Design</p>
                        <p className="text-white text-sm">{selectedQuote.configuration.edge}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Weight</p>
                        <p className="text-white text-sm">{selectedQuote.configuration.weight}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              {selectedQuote.comments && (
                <div>
                  <h3 className="text-sm font-medium text-white/40 mb-3">Additional Comments</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white text-sm">{selectedQuote.comments}</p>
                  </div>
                </div>
              )}

              {/* File */}
              {selectedQuote.file_url && (
                <div>
                  <h3 className="text-sm font-medium text-white/40 mb-3">Uploaded File</h3>
                  <a
                    href={selectedQuote.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-[#c9a962]" />
                    <span className="text-white">View Uploaded File</span>
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