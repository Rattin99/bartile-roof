'use client';

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ArrowLeft, Save, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function AdminTextures() {
  const router = useRouter();
  const [textures, setTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTexture, setEditingTexture] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    map_asset_path: '',
    thumbnail_asset_path: '',
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
        router.push('/');
      }
    } catch {
      router.push('/');
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
      name: texture.name,
      map_asset_path: texture.map_asset_path || '',
      thumbnail_asset_path: texture.thumbnail_asset_path || '',
      sort_order: texture.sort_order || 0
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingTexture(null);
    setFormData({
      name: '',
      map_asset_path: '',
      thumbnail_asset_path: '',
      sort_order: 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, sort_order: parseInt(formData.sort_order) };
      
      if (editingTexture) {
        await base44.entities.TileTexture.update(editingTexture.id, payload);
      } else {
        await base44.entities.TileTexture.create(payload);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading textures...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textures.map((texture) => (
              <Card key={texture.id} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div />
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
                  {texture.thumbnail_asset_path && (
                    <img
                      src={texture.thumbnail_asset_path}
                      alt={texture.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <CardTitle className="text-white">{texture.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm mb-2">{texture.map_asset_path ? 'Map configured' : 'No map'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTexture ? 'Edit Texture' : 'New Texture'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Vintage"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Map Asset Path</Label>
              <Input
                value={formData.map_asset_path}
                onChange={(e) => setFormData({ ...formData, map_asset_path: e.target.value })}
                placeholder="/textures/vintage_map.jpg"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Thumbnail Path</Label>
              <Input
                value={formData.thumbnail_asset_path}
                onChange={(e) => setFormData({ ...formData, thumbnail_asset_path: e.target.value })}
                placeholder="/textures/vintage_thumb.jpg"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)} className="bg-white/5 border-white/10">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
