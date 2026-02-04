import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit, Trash2, ArrowLeft, Save, X, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = ['Slate', 'Split Timber', 'Mission', 'Mediterranean', 'Yorkshire'];

const TILE_IMAGES = [
  { name: 'Legendary Slate', path: '/tiles/legendary.jpeg' },
  { name: 'New England Slate', path: '/tiles/new_england.jpeg' },
  { name: 'Legendary Split Timber', path: '/tiles/legendary_split_timber.jpeg' },
  { name: 'Split Timber', path: '/tiles/split_timber.jpeg' },
  { name: 'Sierra Mission', path: '/tiles/sierra_mission.jpeg' },
  { name: 'European', path: '/tiles/european.jpeg' },
  { name: 'Yorkshire', path: '/tiles/yorkshire.jpeg' },
];

export default function AdminProfiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    profile_id: '',
    name: '',
    category: '',
    description: '',
    image_url: '',
    features: [''],
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    checkAuth();
    loadProfiles();
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

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.TileProfile.list('sort_order');
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      profile_id: profile.profile_id,
      name: profile.name,
      category: profile.category,
      description: profile.description || '',
      image_url: profile.image_url || '',
      features: profile.features || [''],
      is_active: profile.is_active ?? true,
      sort_order: profile.sort_order || 0
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingProfile(null);
    setFormData({
      profile_id: '',
      name: '',
      category: '',
      description: '',
      image_url: '',
      features: [''],
      is_active: true,
      sort_order: 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      const cleanedData = {
        ...formData,
        features: formData.features.filter(f => f.trim())
      };

      if (editingProfile) {
        await base44.entities.TileProfile.update(editingProfile.id, cleanedData);
      } else {
        await base44.entities.TileProfile.create(cleanedData);
      }
      
      setShowDialog(false);
      loadProfiles();
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleDelete = async (profile) => {
    if (!confirm(`Are you sure you want to delete ${profile.name}?`)) return;
    
    try {
      await base44.entities.TileProfile.delete(profile.id);
      loadProfiles();
    } catch (error) {
      console.error('Failed to delete profile:', error);
      alert('Failed to delete profile');
    }
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
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
                <h1 className="text-xl font-semibold">Tile Profiles</h1>
                <p className="text-sm text-white/40">Manage tile profiles and categories</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  if (!confirm('This will attempt to match existing profiles to local images. Continue?')) return;
                  setLoading(true);
                  try {
                    for (const profile of profiles) {
                      let imageUrl = '';
                      const name = profile.name.toLowerCase();
                      if (name.includes('legendary') && name.includes('slate')) imageUrl = '/tiles/legendary.jpeg';
                      else if (name.includes('new england')) imageUrl = '/tiles/new_england.jpeg';
                      else if (name.includes('legendary') && name.includes('split timber')) imageUrl = '/tiles/legendary_split_timber.jpeg';
                      else if (name.includes('split timber')) imageUrl = '/tiles/split_timber.jpeg';
                      else if (name.includes('mission') || name.includes('sierra')) imageUrl = '/tiles/sierra_mission.jpeg';
                      else if (name.includes('european') || name.includes('mediterranean')) imageUrl = '/tiles/european.jpeg';
                      else if (name.includes('yorkshire')) imageUrl = '/tiles/yorkshire.jpeg';

                      if (imageUrl && profile.image_url !== imageUrl) {
                        await base44.entities.TileProfile.update(profile.id, { image_url: imageUrl });
                      }
                    }
                    await loadProfiles();
                    alert('Images updated successfully');
                  } catch (error) {
                    console.error('Bulk update failed:', error);
                    alert('Bulk update failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Auto-fix Images
              </Button>
              <Button
                onClick={handleNew}
                className="bg-[#c9a962] hover:bg-[#b89952] text-[#0f0f0f]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading profiles...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={profile.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {profile.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {profile.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(profile)}
                        className="h-8 w-8 text-white/60 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(profile)}
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {profile.image_url && (
                    <img
                      src={profile.image_url}
                      alt={profile.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <CardTitle className="text-white">{profile.name}</CardTitle>
                  <Badge variant="outline" className="mt-2 w-fit">{profile.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm mb-3 line-clamp-2">{profile.description}</p>
                  {profile.features && profile.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {profile.features.slice(0, 3).map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-white/5">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProfile ? 'Edit Profile' : 'New Profile'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Profile ID *</Label>
                <Input
                  value={formData.profile_id}
                  onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })}
                  placeholder="legendary-slate"
                  className="bg-white/5 border-white/10 text-white"
                  disabled={!!editingProfile}
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
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
                placeholder="Legendary Slate"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the tile profile..."
                rows={3}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label>Image URL</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://... or /tiles/..."
                  className="bg-white/5 border-white/10 text-white flex-1"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {TILE_IMAGES.map((img) => (
                  <button
                    key={img.path}
                    onClick={() => setFormData({ ...formData, image_url: img.path })}
                    className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all ${
                      formData.image_url === img.path ? 'border-[#c9a962]' : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <img src={img.path} alt={img.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                      <span className="text-[8px] text-white truncate">{img.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature"
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFeature(index)}
                      className="text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addFeature}
                  className="w-full bg-white/5 border-white/10 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
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