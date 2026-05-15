# Plan — White Label + Electron Desktop

L'auth, le multi-tenant (RLS par `user_id`), le modèle d'abonnement (essai 2 mois + validation admin), le portail `/admin-login` et le dashboard admin sont **déjà en place** et seront conservés. Ce plan ajoute par-dessus.

---

## Phase 1 — Fondations White Label (DB + contexte global)

**Migration DB** — nouvelle table `app_branding` (config globale plateforme, gérée par super-admin) :
- `app_name`, `tagline`, `logo_url`, `favicon_url`
- `primary_color`, `secondary_color`, `accent_color` (HSL)
- `support_email`, `support_phone`
- `custom_domain` (informatif), `electron_enabled` (bool)
- RLS : lecture publique, écriture admin uniquement (`has_role`)

**Extension table `companies`** (branding par tenant déjà partiel via logo/signature/stamp) :
- ajout `brand_primary`, `brand_secondary`, `brand_app_name` (override par entreprise sur ses propres documents PDF)

**Hook + Provider React** :
- `BrandingProvider` qui charge `app_branding` au démarrage et injecte les variables CSS (`--primary`, `--secondary`, `--accent`) dans `:root`
- Hook `useBranding()` exposant logo, nom app, couleurs

**Composants impactés** :
- `Logo.tsx` → lit `useBranding().logoUrl` et `appName` (fallback nacFacture)
- `Header.tsx`, `Footer.tsx`, `Auth.tsx`, `AdminLogin.tsx`, `Landing.tsx` → utilisent le nom dynamique
- `index.html` → favicon dynamique injecté au runtime

## Phase 2 — Page d'administration White Label

Nouvelle page `/admin/branding` (protégée par `has_role admin`) :
- Upload logo + favicon (bucket `company-assets` existant)
- Pickers HSL pour 3 couleurs principales + preview live
- Champs : nom app, tagline, email support, téléphone support
- Champ informatif `custom_domain` + lien doc DNS Lovable
- Toggle "Mode Electron desktop"
- Sauvegarde → mise à jour immédiate via Realtime sur tous les clients

Ajout d'un onglet "Marque" dans le dashboard admin existant.

## Phase 3 — Branding par tenant (PDF)

Dans `Profil.tsx` → `CompanyProfileForm.tsx` :
- Section "Personnalisation documents" : couleurs primaire/secondaire propres à l'entreprise
- Override appliqué dans `pdfGenerator.ts` (templates bleu/orange existants utilisent ces couleurs au lieu des constantes)

## Phase 4 — Préparation Electron

- `vite.config.ts` : ajout `base: './'`
- `electron/main.cjs` (CommonJS) : `BrowserWindow` 1280×800, `contextIsolation: true`, `nodeIntegration: false`, charge `dist/index.html`
- `electron/preload.cjs` : pont sécurisé minimal (version, platform)
- `package.json` : ajout `"main": "electron/main.cjs"` + script `electron:dev` et `electron:build`
- Détection runtime via `window.process?.versions?.electron` → adapte UI (cache `BottomNav` mobile, élargit sidebar)
- Persistance locale légère via `localStorage` pour cache offline du branding (évite flash de marque par défaut au démarrage)
- Documentation packaging dans `ELECTRON.md` (commande `@electron/packager` pour Linux/Mac/Windows)

**Pas de packaging exécuté maintenant** — uniquement la préparation pour qu'un build futur fonctionne.

## Phase 5 — Vérifs finales

- Linter Supabase sur les nouvelles tables/policies
- Test mode sombre sur la page `/admin/branding`
- Confirmer que `Logo` affiche bien le logo personnalisé après upload
- Mémoires mises à jour (nouvelle entrée `mem://features/white-label`)

---

## Détails techniques

- Couleurs stockées en HSL string (`"222 47% 11%"`) pour injection directe dans `--primary` Tailwind
- Realtime sur `app_branding` → tous les onglets ouverts se rafraîchissent au changement
- Bucket `company-assets` existant réutilisé (sous-dossier `branding/`)
- Aucun changement au modèle d'abonnement (conservé tel quel selon ta réponse)
- Aucun nouveau provider de paiement
- Domaine personnalisé : champ informatif uniquement — la config DNS réelle se fait dans Lovable Project Settings
