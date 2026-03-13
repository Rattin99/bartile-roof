"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Layers,
  Image as ImageIcon,
  Home,
  FileText,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profiles: 0,
    colors: 0,
    textures: 0,
    houses: 0,
    quotes: 0,
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      // Assume role check happens in auth.me or here
      setIsAdmin(true); // For now, assume authorized if auth.me succeeds
      loadStats();
    } catch (error) {
      console.error("Admin check failed:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Fetch counts from our API via base44 adapter
      // Note: .list() returns an array, so .length works.
      const [profiles, colors, textures, houses, quotes] = await Promise.all([
        base44.entities.TileProfile.list(),
        base44.entities.TileColor.list(),
        base44.entities.TileTexture.list(),
        base44.entities.HousePreview.list(),
        base44.entities.QuoteRequest.list(),
      ]);

      setStats({
        profiles: profiles.length,
        colors: colors.length,
        textures: textures.length,
        houses: houses.length,
        quotes: quotes.length,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-white rounded-full"></div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "Tile Profiles",
      desc: "Manage 3D models and profile options",
      icon: <Layers className="w-6 h-6" />,
      path: "/admin/profiles",
      count: stats.profiles,
    },
    {
      title: "Colors",
      desc: "Manage available colors and swatches",
      icon: <Palette className="w-6 h-6" />,
      path: "/admin/colors",
      count: stats.colors,
    },
    {
      title: "Textures",
      desc: "Manage texture maps and finishes",
      icon: <ImageIcon className="w-6 h-6" />,
      path: "/admin/textures",
      count: stats.textures,
    },
    {
      title: "House Previews",
      desc: "Manage inspiration gallery photos",
      icon: <Home className="w-6 h-6" />,
      path: "/admin/houses",
      count: stats.houses,
    },
    {
      title: "Quote Requests",
      desc: "View and manage incoming leads",
      icon: <FileText className="w-6 h-6" />,
      path: "/admin/quotes",
      count: stats.quotes,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-white/60 mt-2">
              Manage your Bartile Configurator content
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-white/20 text-black hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
            <Button variant="destructive" onClick={() => base44.auth.logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card
              key={item.title}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-bold text-white/40">
                    {item.count}
                  </span>
                </div>
                <CardTitle className="text-xl text-white mt-4">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-white/60">
                  {item.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
