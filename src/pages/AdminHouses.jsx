import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit, Trash2, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function AdminHouses() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHouse, setEditingHouse] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    house_id: '',
    name: '',
    image_url: '',
    is_active: true,
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
        navigate(createPageUrl('TileConfigurator'));
      }
    } catch {
      base44.auth.redirectToLogin();
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
      house_id: house.house_id,
      name: house.name,
      image_url: house.image_url,
      is_active: house.is_active ?? true,
      sort_order: house.sort_order || 0
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingHouse(null);
    setFormData({
      house_id: '',
      name: '',
      image_url: '',
      is_active: true,
      sort_order: 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingHouse) {
        await base44.entities.HousePreview.update(editingHouse.id, formData);
      } else {
        await base44.entities.HousePreview.create(formData);
      }
      
      setShowDialog(false);
      loadHouses();
    } catch (error) {
      console.error('Failed to save house:', error);
      alert('Failed to save house preview');
    }
  };

  const handleDelete = async (house) => {
    if (!confirm(`Are you sure you want to delete ${house.name}?`)) return;
    
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
                <h1 className="text-xl font-semibold">House Previews</h1>
                <p className="text-sm text-white/40">Manage preview images for the configurator</p>
              </div>
            </div>
            <Button
              onClick={handleNew}
              className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add House Preview
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading house previews...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
              <Card key={house.id} className="bg-white/5 border-white/10 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  {house.image_url ? (
                    <img
                      src={house.image_url}
                      alt={house.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-white/30">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className={house.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {house.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {house.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(house)}
                      className="h-8 w-8 bg-black/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/80"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(house)}
                      className="h-8 w-8 bg-black/60 backdrop-blur-sm text-red-400 hover:text-red-300 hover:bg-black/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{house.name}</CardTitle>
                  <p className="text-white/40 text-sm">ID: {house.house_id}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>{editingHouse ? 'Edit House Preview' : 'New House Preview'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>House ID *</Label>
              <Input
                value={formData.house_id}
                onChange={(e) => setFormData({ ...formData, house_id: e.target.value })}
                placeholder="modern-estate"
                className="bg-white/5 border-white/10 text-white"
                disabled={!!editingHouse}
              />
            </div>

            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Modern Estate"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Image URL *</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white"
              />
              {formData.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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