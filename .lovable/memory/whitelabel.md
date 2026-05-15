---
name: White Label System
description: Global app branding (logo, name, colors, favicon, support contacts) managed by admin via /admin/branding
type: feature
---
- Table `app_branding` (singleton) stores global branding: app_name, tagline, logo_url, favicon_url, primary/secondary/accent colors (HSL strings), support_email/phone, custom_domain, electron_enabled
- `BrandingProvider` (src/contexts/BrandingProvider.tsx) injects CSS vars at runtime, caches in localStorage to avoid flash
- `useBranding()` exposes branding to components; `Logo.tsx` reads logo_url + app_name with fallback
- Admin-only page `/admin/branding` for editing; realtime sync via Supabase channel
- Per-tenant override fields on `companies`: brand_primary, brand_secondary, brand_app_name (for future PDF use)
- Storage uses existing `company-assets` bucket under `branding/` prefix
