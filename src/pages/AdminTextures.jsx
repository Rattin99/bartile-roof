import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit, Trash2, ArrowLeft, Save, Eye, EyeOff, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function AdminTextures() {
  const navigate = useNavigate();
  const [textures, setTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTexture, setEditingTexture] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    texture_id: '',
    name: '',
    description: '',
    image_url: '',
    is_premium: false,
    note: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    checkAuth();
    loadTextures();
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

  const loadTextures = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.TileTexture.list('sort_order');
      setTextures(data);
    } catch (error) {
      console.error('Failed to load textures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (texture) => {
    setEditingTexture(texture);
    setFormData({
      texture_id: texture.texture_id,
      name: texture.name,
      description: texture.description || '',
      image_url: texture.image_url || '',
      is_premium: texture.is_premium ?? false,
      note: texture.note || '',
      is_active: texture.is_active ?? true,
      sort_order: texture.sort_order || 0
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingTexture(null);
    setFormData({
      texture_id: '',
      name: '',
      description: '',
      image_url: '',
      is_premium: false,
      note: '',
      is_active: true,
      sort_order: 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingTexture) {
        await base44.entities.TileTexture.update(editingTexture.id, formData);
      } else {
        await base44.entities.TileTexture.create(formData);
      }
      
      setShowDialog(false);
      loadTextures();
    } catch (error) {
      console.error('Failed to save texture:', error);
      alert('Failed to save texture');
    }
  };

  const handleDelete = async (texture) => {
    if (!confirm(`Are you sure you want to delete ${texture.name}?`)) return;
    
    try {
      await base44.entities.TileTexture.delete(texture.id);
      loadTextures();
    } catch (error) {
      console.error('Failed to delete texture:', error);
      alert('Failed to delete texture');
    }
  };

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
                <h1 className="text-xl font-semibold">Textures</h1>
                <p className="text-sm text-white/40">Manage texture options</p>
              </div>
            </div>
            <Button
              onClick={handleNew}
              className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Texture
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading textures...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textures.map((texture) => (
              <Card key={texture.id} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <Badge className={texture.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {texture.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        {texture.is_active ? 'Active' : 'Hidden'}
                      </Badge>
                      {texture.is_premium && (
                        <Badge className="bg-[#c9a962]/20 text-[#c9a962]">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(texture)}
                        className="h-8 w-8 text-white/60 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(texture)}
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {texture.image_url && (
                    <img
                      src={texture.image_url}
                      alt={texture.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <CardTitle className="text-white">{texture.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm mb-2 line-clamp-2">{texture.description}</p>
                  {texture.note && (
                    <p className="text-[#c9a962] text-xs mt-2">Note: {texture.note}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTexture ? 'Edit Texture' : 'New Texture'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Texture ID *</Label>
                <Input
                  value={formData.texture_id}
                  onChange={(e) => setFormData({ ...formData, texture_id: e.target.value })}
                  placeholder="vintage"
                  className="bg-white/5 border-white/10 text-white"
                  disabled={!!editingTexture}
                />
              </div>
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vintage"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the texture..."
                rows={3}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Note (Optional)</Label>
              <Input
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="e.g., 70% of tiles will simulate moss..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label>Premium</Label>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label>Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="bg-white/5 border-white/10">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}