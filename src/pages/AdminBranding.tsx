import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthProvider";
import { useBranding } from "@/contexts/BrandingProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Palette, Globe, Save } from "lucide-react";

const HSL_HELP = "Format HSL : ex. 221 83% 53%";

const AdminBranding = () => {
  const { user, isAdmin } = useAuth();
  const { branding, refresh } = useBranding();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(branding);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);

  useEffect(() => {
    if (!user) { navigate("/admin-login"); return; }
    if (!isAdmin) { navigate("/"); return; }
  }, [user, isAdmin, navigate]);

  useEffect(() => { setForm(branding); }, [branding]);

  const update = (k: keyof typeof form, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const uploadFile = async (file: File, kind: "logo" | "favicon") => {
    if (!user) return;
    setUploading(kind);
    const ext = file.name.split(".").pop();
    const path = `branding/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("company-assets").getPublicUrl(path);
    update(kind === "logo" ? "logo_url" : "favicon_url", data.publicUrl);
    setUploading(null);
    toast({ title: "Image uploadée", description: "N'oubliez pas de sauvegarder." });
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      app_name: form.app_name,
      tagline: form.tagline,
      logo_url: form.logo_url,
      favicon_url: form.favicon_url,
      primary_color: form.primary_color,
      secondary_color: form.secondary_color,
      accent_color: form.accent_color,
      support_email: form.support_email,
      support_phone: form.support_phone,
      custom_domain: form.custom_domain,
      electron_enabled: form.electron_enabled,
    };
    const { error } = await (supabase as any)
      .from("app_branding")
      .update(payload)
      .eq("id", branding.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Marque mise à jour", description: "Les changements sont visibles en temps réel." });
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <Palette className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">White Label — Marque de l'application</h1>
            <p className="text-sm text-muted-foreground">Personnalisez l'identité visuelle globale de la plateforme.</p>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Identité</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nom de l'application</Label>
              <Input value={form.app_name} onChange={e => update("app_name", e.target.value)} />
            </div>
            <div>
              <Label>Slogan / Tagline</Label>
              <Input value={form.tagline ?? ""} onChange={e => update("tagline", e.target.value)} />
            </div>
            <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-3">
                  {form.logo_url && <img src={form.logo_url} alt="logo" className="h-16 w-16 object-contain rounded border bg-muted" />}
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploading === "logo"} asChild>
                      <span>
                        {uploading === "logo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Téléverser
                      </span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "logo")} />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-3">
                  {form.favicon_url && <img src={form.favicon_url} alt="favicon" className="h-10 w-10 object-contain rounded border bg-muted" />}
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploading === "favicon"} asChild>
                      <span>
                        {uploading === "favicon" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Téléverser
                      </span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "favicon")} />
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Couleurs (HSL)</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {(["primary_color", "secondary_color", "accent_color"] as const).map(key => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key.replace("_color", "")}</Label>
                <Input value={form[key]} onChange={e => update(key, e.target.value)} placeholder="221 83% 53%" />
                <div className="h-8 rounded border" style={{ background: `hsl(${form[key]})` }} />
                <p className="text-[10px] text-muted-foreground">{HSL_HELP}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact & support</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Email support</Label>
              <Input type="email" value={form.support_email ?? ""} onChange={e => update("support_email", e.target.value)} />
            </div>
            <div>
              <Label>Téléphone support</Label>
              <Input value={form.support_phone ?? ""} onChange={e => update("support_phone", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Domaine & Desktop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Domaine personnalisé</Label>
              <Input value={form.custom_domain ?? ""} onChange={e => update("custom_domain", e.target.value)} placeholder="app.mondomaine.com" />
              <p className="text-xs text-muted-foreground mt-1">
                Champ informatif. La configuration DNS réelle se fait auprès de votre hébergeur de domaine.
              </p>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Mode Electron Desktop</Label>
                <p className="text-xs text-muted-foreground">Active les optimisations pour la version desktop.</p>
              </div>
              <Switch checked={form.electron_enabled} onCheckedChange={v => update("electron_enabled", v)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end sticky bottom-4">
          <Button onClick={save} disabled={saving} size="lg" className="shadow-lg">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBranding;