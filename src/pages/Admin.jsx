import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutGrid, 
  Palette, 
  Sparkles, 
  Home as HomeIcon, 
  FileText,
  Users,
  Settings,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ADMIN_SECTIONS = [
  {
    id: 'profiles',
    title: 'Tile Profiles',
    description: 'Manage tile profiles, categories, and features',
    icon: LayoutGrid,
    color: 'bg-blue-500',
    page: 'AdminProfiles'
  },
  {
    id: 'colors',
    title: 'Colors',
    description: 'Add, edit, and organize color options',
    icon: Palette,
    color: 'bg-purple-500',
    page: 'AdminColors'
  },
  {
    id: 'textures',
    title: 'Textures',
    description: 'Manage texture options and premium upgrades',
    icon: Sparkles,
    color: 'bg-pink-500',
    page: 'AdminTextures'
  },
  {
    id: 'houses',
    title: 'House Previews',
    description: 'Update preview images for the configurator',
    icon: HomeIcon,
    color: 'bg-green-500',
    page: 'AdminHouses'
  },
  {
    id: 'quotes',
    title: 'Quote Requests',
    description: 'View and manage customer quote requests',
    icon: FileText,
    color: 'bg-orange-500',
    page: 'AdminQuotes'
  }
];

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profiles: 0,
    colors: 0,
    textures: 0,
    houses: 0,
    quotes: 0
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (currentUser.role !== 'admin') {
        navigate(createPageUrl('TileConfigurator'));
        return;
      }
      setUser(currentUser);
    } catch (error) {
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [profiles, colors, textures, houses, quotes] = await Promise.all([
        base44.entities.TileProfile.list(),
        base44.entities.TileColor.list(),
        base44.entities.TileTexture.list(),
        base44.entities.HousePreview.list(),
        base44.entities.QuoteRequest.list()
      ]);

      setStats({
        profiles: profiles.length,
        colors: colors.length,
        textures: textures.length,
        houses: houses.length,
        quotes: quotes.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                  <span className="text-[#0f0f0f] font-bold text-lg">B</span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Bartile Roof Designer</h1>
                  <p className="text-sm text-white/40">Admin Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/60">Logged in as</p>
                <p className="font-medium">{user?.full_name || user?.email}</p>
              </div>
              <Button
                onClick={() => navigate(createPageUrl('TileConfigurator'))}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                View Configurator
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-light mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}</h2>
          <p className="text-white/50">Manage your roof designer configurator settings and content</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{stats.profiles}</div>
              <div className="text-xs text-white/50">Tile Profiles</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{stats.colors}</div>
              <div className="text-xs text-white/50">Colors</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{stats.textures}</div>
              <div className="text-xs text-white/50">Textures</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{stats.houses}</div>
              <div className="text-xs text-white/50">House Previews</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{stats.quotes}</div>
              <div className="text-xs text-white/50">Quote Requests</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => navigate(createPageUrl(section.page))}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-white">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm">{section.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-6 bg-[#c9a962]/10 border border-[#c9a962]/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c9a962]/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-[#c9a962]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-1">Need Help?</h3>
              <p className="text-white/60 text-sm mb-4">
                Check out our admin guide or contact support for assistance with managing your configurator.
              </p>
              <Button
                variant="outline"
                className="bg-[#c9a962]/20 border-[#c9a962]/30 text-[#c9a962] hover:bg-[#c9a962]/30"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}