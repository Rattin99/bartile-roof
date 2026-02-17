'use client';

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Edit, 
  Upload, 
  Eye, 
  EyeOff, 
  Check, 
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminProfiles() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      loadProfiles();
    } catch {
      router.push('/');
    }
  };

  const loadProfiles = async () => {
    try {
      const data = await base44.entities.TileProfile.list('sort_order');
      setProfiles(data);
    } catch (error) {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Convert checkbox/switch values
    const cleanedData = {
      ...data,
      is_active: data.is_active === 'on',
      sort_order: parseInt(data.sort_order || 0),
    };

    try {
      if (editingProfile) {
        await base44.entities.TileProfile.update(editingProfile.id, cleanedData);
        toast.success("Profile updated");
      } else {
        await base44.entities.TileProfile.create(cleanedData);
        toast.success("Profile created");
      }
      setIsDialogOpen(false);
      loadProfiles();
      setEditingProfile(null);
    } catch (error) {
      toast.error("Failed to save profile");
    }
  };

  const handleDelete = async (profile) => {
    if (!confirm(`Delete ${profile.name}?`)) return;
    try {
      await base44.entities.TileProfile.delete(profile.id);
      toast.success("Profile deleted");
      loadProfiles();
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  const handleFileUpload = async (file, type) => {
    setIsUploading(true);
    try {
      const { url } = await base44.integrations.Core.UploadFile({ file });
      return url; // In a real app, you'd set this URL into a hidden input or state
    } catch (error) {
      toast.error("Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin')} className="text-white hover:text-white/80">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Tile Profiles</h1>
          </div>
          <Button onClick={() => { setEditingProfile(null); setIsDialogOpen(true); }} className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            Add Profile
          </Button>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Order</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{profile.name}</TableCell>
                  <TableCell className="text-white/60 truncate max-w-[200px]">{profile.description}</TableCell>
                  <TableCell>
                    {profile.is_active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-white/60">{profile.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => { setEditingProfile(profile); setIsDialogOpen(true); }}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(profile)}
                        className="text-white/60 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>{editingProfile ? 'Edit Profile' : 'New Profile'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingProfile?.name} required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingProfile?.description} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input type="number" id="sort_order" name="sort_order" defaultValue={editingProfile?.sort_order || 0} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="flex items-center justify-between pt-8">
                  <Label htmlFor="is_active">Active Status</Label>
                  <Switch id="is_active" name="is_active" defaultChecked={editingProfile?.is_active ?? true} />
                </div>
              </div>
              {/* Asset paths inputs would go here, simplified for now */}
              <div className="space-y-2">
                 <Label htmlFor="model_asset_path">3D Model Path (STL)</Label>
                 <Input id="model_asset_path" name="model_asset_path" defaultValue={editingProfile?.model_asset_path} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="icon_asset_path">Icon Path (Image)</Label>
                 <Input id="icon_asset_path" name="icon_asset_path" defaultValue={editingProfile?.icon_asset_path} className="bg-white/5 border-white/10 text-white" />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white hover:bg-white/10">Cancel</Button>
                <Button type="submit" className="bg-white text-black hover:bg-gray-200">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
