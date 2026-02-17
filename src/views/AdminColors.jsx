import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit, Trash2, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const COLOR_CATEGORIES = ['Dark', 'Gray', 'Brown', 'Tan', 'Red', 'Green', 'Blue'];

export default function AdminColors() {
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingColor, setEditingColor] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    color_id: '',
    name: '',
    hex: '#666666',
    category: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    checkAuth();
    loadColors();
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

  const loadColors = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.TileColor.list('sort_order');
      setColors(data);
    } catch (error) {
      console.error('Failed to load colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (color) => {
    setEditingColor(color);
    setFormData({
      color_id: color.color_id,
      name: color.name,
      hex: color.hex,
      category: color.category,
      is_active: color.is_active ?? true,
      sort_order: color.sort_order || 0
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingColor(null);
    setFormData({
      color_id: '',
      name: '',
      hex: '#666666',
      category: '',
      is_active: true,
      sort_order: 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingColor) {
        await base44.entities.TileColor.update(editingColor.id, formData);
      } else {
        await base44.entities.TileColor.create(formData);
      }
      
      setShowDialog(false);
      loadColors();
    } catch (error) {
      console.error('Failed to save color:', error);
      alert('Failed to save color');
    }
  };

  const handleDelete = async (color) => {
    if (!confirm(`Are you sure you want to delete ${color.name}?`)) return;
    
    try {
      await base44.entities.TileColor.delete(color.id);
      loadColors();
    } catch (error) {
      console.error('Failed to delete color:', error);
      alert('Failed to delete color');
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
                <h1 className="text-xl font-semibold">Colors</h1>
                <p className="text-sm text-white/40">Manage color options</p>
              </div>
            </div>
            <Button
              onClick={handleNew}
              className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Color
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading colors...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colors.map((color) => (
              <div
                key={color.id}
                className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={color.is_active ? 'bg-green-500/20 text-green-400 text-xs' : 'bg-red-500/20 text-red-400 text-xs'}>
                    {color.is_active ? <Eye className="w-2 h-2 mr-1" /> : <EyeOff className="w-2 h-2 mr-1" />}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(color)}
                      className="h-6 w-6 text-white/60 hover:text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(color)}
                      className="h-6 w-6 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div 
                  className="aspect-square rounded-lg mb-3"
                  style={{ backgroundColor: color.hex }}
                />
                
                <div>
                  <p className="text-sm font-medium text-white truncate">{color.name}</p>
                  <p className="text-xs text-white/40">#{color.color_id}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{color.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>{editingColor ? 'Edit Color' : 'New Color'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Color ID *</Label>
                <Input
                  value={formData.color_id}
                  onChange={(e) => setFormData({ ...formData, color_id: e.target.value })}
                  placeholder="33"
                  className="bg-white/5 border-white/10 text-white"
                  disabled={!!editingColor}
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Charcoal"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Hex Color *</Label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={formData.hex}
                  onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                  className="w-20 h-10 bg-white/5 border-white/10"
                />
                <Input
                  value={formData.hex}
                  onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                  placeholder="#666666"
                  className="flex-1 bg-white/5 border-white/10 text-white"
                />
              </div>
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