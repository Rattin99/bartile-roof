'use client';

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function AdminHouses() {
  const router = useRouter();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHouse, setEditingHouse] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    tags: '', // Comma separated
    sort_order: 0
  });

  useEffect(() => {
    checkAuth();
    loadHouses();
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

  const loadHouses = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.HousePreview.list('sort_order');
      setHouses(data);
    } catch (error) {
      console.error('Failed to load houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (house) => {
    setEditingHouse(house);
    setFormData({
      image_url: house.image_url,
      tags: house.tags ? house.tags.join(', ') : '',
      sort_order: house.sort_order || 0
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingHouse(null);
    setFormData({
      image_url: '',
      tags: '',
      sort_order: 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = { 
        ...formData, 
        tags: tagsArray,
        sort_order: parseInt(formData.sort_order) 
      };

      if (editingHouse) {
        await base44.entities.HousePreview.update(editingHouse.id, payload);
      } else {
        await base44.entities.HousePreview.create(payload);
      }
      
      setShowDialog(false);
      loadHouses();
    } catch (error) {
      console.error('Failed to save house:', error);
      alert('Failed to save house preview');
    }
  };

  const handleDelete = async (house) => {
    if (!confirm('Delete this house preview?')) return;
    try {
      await base44.entities.HousePreview.delete(house.id);
      loadHouses();
    } catch (error) {
      console.error('Failed to delete house:', error);
      alert('Failed to delete house preview');
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
                <h1 className="text-xl font-semibold">House Previews</h1>
                <p className="text-sm text-white/40">Manage inspiration gallery</p>
              </div>
            </div>
            <Button
              onClick={handleNew}
              className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Preview
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading house previews...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
              <Card key={house.id} className="bg-white/5 border-white/10 overflow-hidden">
                <div className="relative h-48 overflow-hidden group">
                  {house.image_url ? (
                    <img
                      src={house.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-white/30">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(house)}
                      className="h-8 w-8 bg-black/60 backdrop-blur-sm text-white/80 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(house)}
                      className="h-8 w-8 bg-black/60 backdrop-blur-sm text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex gap-1 flex-wrap">
                     {house.tags && house.tags.map(t => (
                         <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                     ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>{editingHouse ? 'Edit House Preview' : 'New House Preview'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Image URL *</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Tags (Comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Modern, Slate, Dark"
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
