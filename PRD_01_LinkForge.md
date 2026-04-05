# LinkForge — Product Requirements Document

---

## 1. Vision Produit

**LinkForge** est un builder de pages link-in-bio nouvelle génération. L'utilisateur crée en quelques minutes une page personnalisée regroupant tous ses liens (réseaux sociaux, portfolio, projets, contact) avec un design premium et des analytics intégrés.

**Tagline** : *"Your links. Your brand. One page."*

**Pourquoi ce projet existe** : Linktree est devenu générique. Les créateurs, freelances et étudiants veulent une page qui reflète vraiment leur identité — pas un template fade avec un logo en watermark. LinkForge offre un niveau de customisation que les concurrents gratuits ne proposent pas, avec une expérience visuelle digne d'une startup Y Combinator.

---

## 2. Cible Utilisateur

| Persona | Description | Besoin principal |
|---|---|---|
| **Le freelance tech** | Dev/designer qui veut centraliser ses liens pro | Page clean, rapide, crédible |
| **L'étudiant UTT** | Cherche un stage ou des mini-missions | Mettre en avant projets + contact |
| **Le créateur de contenu** | Streamer, YouTuber, artiste | Branding fort, analytics, personnalisation |

---

## 3. Fonctionnalités Core (MVP)

### 3.1 Création de page

- **Inscription / Connexion** : Email + mot de passe (JWT)
- **URL personnalisée** : `linkf.vgtray.fr/adam` — claim de username unique
- **Éditeur drag & drop** : Réorganiser les blocs de liens par glisser-déposer
- **Types de blocs** :
  - Lien classique (titre + URL + icône optionnelle)
  - Header / séparateur de section
  - Bloc réseau social (icônes auto-détectées : GitHub, LinkedIn, Twitter, Instagram, etc.)
  - Bloc "À propos" (mini bio avec avatar)
  - Bloc embed (vidéo YouTube, Spotify, etc.)

### 3.2 Thèmes & Customisation

- **5 thèmes de base** : Minimal Light, Minimal Dark, Glassmorphism, Gradient Neon, Brutalist
- **Customisation fine** :
  - Couleur de fond (solid, gradient, image)
  - Couleur des boutons / hover
  - Border radius des liens (sharp → pill)
  - Typographie (3-4 Google Fonts au choix)
  - Espacement entre les blocs
- **Preview live** : L'utilisateur voit sa page en temps réel pendant l'édition
- **Responsive** : La page finale est mobile-first par défaut

### 3.3 Analytics

- **Dashboard simple** :
  - Nombre total de vues (page views)
  - Nombre de clics par lien
  - Taux de clic (CTR) par lien
  - Graphique de vues sur les 7/30 derniers jours
- **Données anonymes** : Pas de tracking intrusif, juste les compteurs essentiels

### 3.4 Partage & SEO

- **Meta tags** auto-générés (Open Graph, Twitter Card)
- **Favicon** personnalisé
- **QR Code** : Généré automatiquement pour chaque page, téléchargeable en PNG/SVG

---

## 4. Architecture Technique

### 4.1 Stack

| Couche | Technologie | Justification |
|---|---|---|
| **Front-end** | Next.js 14 (App Router) + TypeScript | SSR/SSG natif, performance, routing moderne |
| **Styling** | Tailwind CSS + Shadcn/UI | Design system pro, composants accessibles, customisables |
| **Animations** | GSAP + Framer Motion | Animations premium : scroll-triggered, morphing, stagger reveals |
| **3D / Effets visuels** | Three.js + React Three Fiber + Drei | Backgrounds 3D interactifs sur la landing, particle systems |
| **Smooth Scroll** | Lenis (by Studio Freight) | Smooth scroll inertiel premium, standard en web design haut de gamme |
| **Drag & Drop** | dnd-kit | Léger, performant, accessible, meilleur que react-beautiful-dnd |
| **Back-end** | Node.js + Express + TypeScript | API REST légère, écosystème JS unifié |
| **Base de données** | PostgreSQL (self-hosted sur VPS) | Relationnel, fiable, full contrôle |
| **ORM** | Prisma | Type-safe, migrations auto, schema déclaratif |
| **Auth** | JWT (jsonwebtoken) + bcrypt | Email/password, tokens signés, refresh tokens en httpOnly cookie |
| **Hosting** | VPS personnel + Dokploy | PaaS self-hosted, deploy automatique, SSL auto, Docker natif |
| **Domaine** | `linkf.vgtray.fr` | Sous-domaine du portfolio, DNS géré via Dokploy |
| **Analytics** | Custom (table PostgreSQL) | Léger, pas de dépendance externe |
| **Storage** | Volume Docker persistant + Multer | Upload avatars/images, servis en static |
| **Fonts** | Google Fonts (Inter, Geist, Satoshi, Cabinet Grotesk) | Typos modernes, chargement optimisé via `next/font` |
| **Icons** | Lucide React + Phosphor Icons | Clean, consistant, SVG optimisés |
| **CI/CD** | Dokploy (auto-deploy on push) | Push to main = build Docker → deploy → zero downtime |

### 4.2 Structure du projet

```
linkforge/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Landing page, pricing, about
│   │   ├── page.tsx              # Landing page avec hero 3D
│   │   └── layout.tsx            # Layout avec smooth scroll global
│   ├── (auth)/                   # Login, register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Espace connecté
│   │   ├── editor/page.tsx       # Éditeur split-view
│   │   ├── analytics/page.tsx    # Dashboard analytics
│   │   └── settings/page.tsx     # Paramètres compte
│   ├── [username]/page.tsx       # Page publique dynamique (SSR)
│   └── api/                      # Route handlers Next.js
│       ├── auth/
│       ├── pages/
│       ├── blocks/
│       └── analytics/
├── components/
│   ├── ui/                       # Shadcn/UI components
│   ├── landing/                  # Composants landing page
│   │   ├── Hero3D.tsx            # Scene Three.js (particles/globe)
│   │   ├── FeatureCards.tsx       # Cards avec reveal GSAP
│   │   ├── DemoPreview.tsx       # Preview interactive animée
│   │   ├── Testimonials.tsx      # Carousel smooth
│   │   └── CTASection.tsx        # CTA avec gradient animé
│   ├── editor/                   # Composants éditeur
│   │   ├── BlockList.tsx         # Liste drag & drop (dnd-kit)
│   │   ├── ThemePicker.tsx       # Sélecteur de thème
│   │   ├── ColorPicker.tsx       # Picker couleur custom
│   │   ├── LivePreview.tsx       # Preview temps réel
│   │   └── BlockEditor.tsx       # Éditeur de bloc individuel
│   ├── analytics/                # Composants dashboard
│   │   ├── KPICards.tsx          # Cards animées avec compteurs
│   │   ├── ClickChart.tsx        # Graphique recharts + animations
│   │   └── LinkTable.tsx         # Tableau des liens par CTR
│   └── shared/                   # Composants partagés
│       ├── SmoothScroll.tsx      # Provider Lenis
│       ├── PageTransition.tsx    # Transitions entre pages (Framer Motion)
│       ├── MagneticButton.tsx    # Bouton magnétique (cursor follow)
│       ├── TextReveal.tsx        # Reveal texte lettre par lettre
│       ├── ParallaxSection.tsx   # Section avec parallax GSAP
│       └── GradientBlur.tsx      # Background gradient blur animé
├── server/                       # Back-end Express (API)
│   ├── index.ts                  # Entry point Express
│   ├── routes/
│   │   ├── auth.ts               # Register, login, logout, me
│   │   ├── pages.ts              # CRUD pages
│   │   ├── blocks.ts             # CRUD blocs
│   │   └── analytics.ts          # Events + stats
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification middleware
│   │   ├── rateLimit.ts          # Rate limiting (express-rate-limit)
│   │   └── upload.ts             # Multer config pour images
│   ├── services/
│   │   ├── auth.service.ts       # Logique auth (hash, tokens, refresh)
│   │   ├── page.service.ts       # Logique pages
│   │   └── analytics.service.ts  # Agrégation stats
│   └── prisma/
│       └── schema.prisma         # Schéma Prisma (PostgreSQL)
├── lib/
│   ├── api.ts                    # Client API (fetch wrapper avec auth)
│   ├── animations.ts             # Presets GSAP réutilisables
│   ├── three-scenes.ts           # Scènes Three.js pré-configurées
│   └── utils.ts                  # Helpers
├── hooks/
│   ├── useGSAP.ts                # Hook custom GSAP + cleanup
│   ├── useLenis.ts               # Hook smooth scroll
│   ├── useInView.ts              # Intersection Observer pour triggers
│   └── useMousePosition.ts       # Position curseur pour effets magnétiques
├── styles/
│   └── globals.css               # Tailwind + custom properties + smooth scroll base
└── public/
    ├── fonts/                    # Fonts locales (Satoshi, Cabinet Grotesk)
    └── textures/                 # Textures pour Three.js (noise, gradient maps)
```

### 4.3 Structure de la base de données (Prisma Schema)

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password_hash String                          // bcrypt hash
  username      String   @unique                // → détermine l'URL publique
  avatar_url    String?
  refresh_token String?                         // JWT refresh token (hashé)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  page          Page?
}

model Page {
  id              String   @id @default(uuid())
  user            User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  user_id         String   @unique
  title           String?
  bio             String?
  theme           Json     @default("{}")       // couleurs, fonts, border-radius, bg...
  seo_title       String?
  seo_description String?
  favicon_url     String?
  is_published    Boolean  @default(false)
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  blocks          Block[]
  events          AnalyticsEvent[]
}

model Block {
  id         String   @id @default(uuid())
  page       Page     @relation(fields: [page_id], references: [id], onDelete: Cascade)
  page_id    String
  type       BlockType                          // link, header, social, about, embed
  title      String?
  url        String?
  icon       String?
  position   Int                                // ordre d'affichage (drag & drop)
  settings   Json     @default("{}")            // config spécifique au type de bloc
  is_visible Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  events     AnalyticsEvent[]
}

enum BlockType {
  link
  header
  social
  about
  embed
}

model AnalyticsEvent {
  id         String    @id @default(uuid())
  page       Page      @relation(fields: [page_id], references: [id], onDelete: Cascade)
  page_id    String
  block      Block?    @relation(fields: [block_id], references: [id])
  block_id   String?                            // null = page view, non-null = clic sur un lien
  event_type EventType
  referrer   String?
  ip_hash    String?                            // IP hashée pour dédoublonner sans tracker
  user_agent String?
  created_at DateTime  @default(now())

  @@index([page_id, created_at])               // Index pour les requêtes analytics
  @@index([page_id, block_id])
}

enum EventType {
  view
  click
}
```

### 4.4 Infrastructure — Dokploy sur VPS

```
VPS (Ubuntu / Debian)
└── Dokploy (PaaS self-hosted)
    ├── Projet: linkforge
    │   ├── Service: linkforge-front          # Next.js (App)
    │   │   ├── Type: Application (Dockerfile)
    │   │   ├── Domaine: linkf.vgtray.fr
    │   │   ├── SSL: Auto (Let's Encrypt via Dokploy)
    │   │   ├── Port: 3000
    │   │   ├── Auto-deploy: ON (push to main)
    │   │   └── Env vars: DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_API_URL
    │   │
    │   ├── Service: linkforge-api            # Express (API)
    │   │   ├── Type: Application (Dockerfile)
    │   │   ├── Domaine: api.linkf.vgtray.fr
    │   │   ├── SSL: Auto
    │   │   ├── Port: 4000
    │   │   ├── Auto-deploy: ON (push to main)
    │   │   ├── Volumes: ./uploads:/app/uploads  # Persistance images
    │   │   └── Env vars: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
    │   │
    │   └── Service: linkforge-db             # PostgreSQL
    │       ├── Type: Database (PostgreSQL 16)
    │       ├── Port: 5432 (interne uniquement)
    │       ├── Volume: postgres_data (persistant)
    │       └── Backups: Dokploy scheduled backups (daily)
    │
    └── Traefik (géré par Dokploy)            # Reverse proxy automatique
        ├── SSL auto via Let's Encrypt
        ├── Routing: linkf.vgtray.fr → front:3000
        ├── Routing: api.linkf.vgtray.fr → api:4000
        └── Headers security auto
```

**Docker Compose (géré par Dokploy)** :
```yaml
version: "3.8"

services:
  front:
    build:
      context: .
      dockerfile: Dockerfile.front
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://linkforge:${DB_PASSWORD}@db:5432/linkforge_db
      - NEXT_PUBLIC_API_URL=https://api.linkf.vgtray.fr
    depends_on:
      - db

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://linkforge:${DB_PASSWORD}@db:5432/linkforge_db
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    volumes:
      - uploads_data:/app/uploads
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=linkforge
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=linkforge_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
  uploads_data:
```

**Dockerfiles** :
```dockerfile
# Dockerfile.front
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile.api
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build:api

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000
CMD ["npx", "prisma", "migrate", "deploy", "&&", "node", "dist/server/index.js"]
```

### 4.5 API Endpoints

```
Auth
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  GET    /api/auth/me

Pages
  GET    /api/pages/:username        → page publique (rendu SSR)
  GET    /api/pages/me               → page de l'utilisateur connecté (édition)
  PUT    /api/pages/me               → update page (thème, bio, SEO...)
  POST   /api/pages/me/publish       → toggle publication

Blocks
  GET    /api/blocks                  → liste des blocs de la page de l'user
  POST   /api/blocks                  → créer un bloc
  PUT    /api/blocks/:id              → modifier un bloc
  DELETE /api/blocks/:id              → supprimer un bloc
  PUT    /api/blocks/reorder          → réordonner les blocs (drag & drop)

Analytics
  POST   /api/analytics/event         → enregistrer un event (view ou click)
  GET    /api/analytics/summary       → stats agrégées (dashboard)
  GET    /api/analytics/timeline      → données pour le graphique temporel

Utils
  GET    /api/username/check/:name    → vérifier disponibilité du username
  GET    /api/qrcode/:username        → générer le QR code
```

---

## 5. Design UI/UX — Direction Artistique Premium

### 5.1 Philosophie Design

Le design de LinkForge s'inscrit dans la mouvance **"New Minimalism"** — un minimalisme enrichi par des micro-interactions, des animations fluides et des touches de 3D. L'inspiration directe vient des sites qui définissent les standards actuels du web design haut de gamme.

**Références visuelles** :
- **Linear.app** — Transitions ultra-smooth, glassmorphism subtil, dark mode premium
- **Vercel.com** — Gradient meshes, typographie forte, animations de scroll
- **Raycast.com** — Spotlight effects, glow sur hover, profondeur par les ombres
- **Stripe.com** — Illustrations 3D légères, parallax, couleurs vibrantes
- **Framer.com** — Animations orchestrées, preview interactive, fluidité totale

### 5.2 Landing Page — Le Showcase

La landing page est la vitrine du projet. Elle doit donner l'impression d'un produit à $10M de funding.

#### Hero Section
- **Background** : Scène Three.js — champ de particules interactives qui réagissent au curseur (style constellation/réseau), ou globe 3D rotatif avec des points lumineux représentant les utilisateurs
- **Titre** : Reveal lettre par lettre avec GSAP `SplitText`, puis subtle floating animation
- **Sous-titre** : Fade-in avec délai, tracking élargi
- **CTA** : Bouton magnétique (suit le curseur dans un rayon de 20px), glow effect au hover, gradient border animé
- **Mock-up** : Preview d'une page LinkForge dans un iPhone frame avec parallax tilt au scroll

#### Features Section
- **Layout** : Bento grid (style Apple) — cards de tailles variées
- **Animation** : Chaque card révélée au scroll avec `ScrollTrigger` de GSAP, stagger de 0.1s entre chaque card
- **Hover** : Tilt 3D léger sur les cards (style `vanilla-tilt`), spotlight effect qui suit le curseur sur la surface de la card
- **Contenu** : Icône animée (Lottie ou SVG animé), titre, description courte, mini preview

#### Demo Interactive
- **Concept** : Un éditeur simplifié embarqué dans la landing — l'utilisateur peut changer les couleurs et voir le résultat en temps réel sans créer de compte
- **Animation** : Le téléphone mock-up se met à jour en smooth avec Framer Motion `layoutId` transitions

#### Social Proof / Testimonials
- **Carousel** infini avec défilement automatique smooth (Framer Motion)
- **Cards** : Glassmorphism, avatar rond, citation, étoiles

#### CTA Final
- **Background** : Gradient mesh animé (CSS `@property` pour animer les couleurs)
- **Texte** : Grande typo, reveal au scroll
- **Bouton** : Même style magnétique que le hero

#### Footer
- **Minimaliste** : Links, socials, copyright
- **Easter egg** : Le logo LinkForge a une micro-animation au hover

### 5.3 Dashboard / Éditeur

- **Layout** : Split view — panneau d'édition à gauche (40%), preview live à droite (60%)
- **Thème** : Dark mode par défaut (`#09090B` fond, `#18181B` cards, `#FAFAFA` texte)
- **Sidebar** : Navigation verticale avec icônes Lucide, indicateur actif animé (slide)
- **Drag & drop** : Feedback visuel avec ombre portée élevée, slot placeholder animé
- **Auto-save** : Indicateur discret "Saved" avec check animé après chaque modification
- **Transitions** : Framer Motion `AnimatePresence` sur les panneaux qui changent
- **Toasts** : Sonner (par @emilkowalski) — notifications minimalistes et élégantes

### 5.4 Page Publique (link-in-bio)

- **Performance first** : Pas de Three.js ni GSAP sur la page publique — uniquement CSS animations pour garder un load < 800ms
- **Animations légères** : Stagger fade-in des liens au chargement (CSS `@keyframes` + `animation-delay`), hover scale + glow sur les boutons
- **Responsive** : Mobile-first, max-width 480px centré sur desktop
- **Thème dynamique** : Les variables CSS sont injectées dynamiquement depuis le JSON du thème

### 5.5 Palette & Typographie

**Application (éditeur, dashboard, landing)** :

| Token | Valeur | Usage |
|---|---|---|
| `--bg-primary` | `#09090B` | Fond principal |
| `--bg-secondary` | `#18181B` | Cards, sidebars |
| `--bg-tertiary` | `#27272A` | Inputs, hover states |
| `--text-primary` | `#FAFAFA` | Titres, texte principal |
| `--text-secondary` | `#A1A1AA` | Texte secondaire, labels |
| `--accent` | `#3B82F6` | CTAs, liens, focus rings |
| `--accent-hover` | `#2563EB` | Hover sur accent |
| `--gradient-start` | `#3B82F6` | Gradients |
| `--gradient-end` | `#8B5CF6` | Gradients |
| `--success` | `#22C55E` | Confirmations |
| `--error` | `#EF4444` | Erreurs |
| `--border` | `#27272A` | Bordures subtiles |

**Typographie** :

| Usage | Font | Weight | Taille |
|---|---|---|---|
| Titres landing (hero) | Cabinet Grotesk | 800 (Extra Bold) | 64-80px |
| Titres sections | Satoshi | 700 (Bold) | 32-48px |
| Sous-titres | Inter | 500 (Medium) | 18-24px |
| Corps de texte | Inter | 400 (Regular) | 14-16px |
| Labels / small | Inter | 500 (Medium) | 12-13px |
| Code / mono | JetBrains Mono | 400 | 13-14px |

### 5.6 Effets & Micro-interactions — Catalogue

| Effet | Technologie | Où |
|---|---|---|
| Smooth scroll inertiel | Lenis | Global (landing + dashboard) |
| Reveal texte au scroll | GSAP ScrollTrigger + SplitText | Titres landing |
| Stagger reveal cards | GSAP ScrollTrigger | Features, testimonials |
| Parallax layers | GSAP ScrollTrigger | Hero mock-up, backgrounds |
| Bouton magnétique | Custom hook `useMousePosition` + spring | CTAs principaux |
| Card tilt 3D | `react-tilt` ou custom | Feature cards |
| Spotlight on hover | CSS `radial-gradient` + mouse tracking | Cards, boutons |
| Particle field 3D | Three.js + React Three Fiber | Hero background |
| Gradient mesh animé | CSS `@property` + keyframes | CTA section |
| Page transitions | Framer Motion `AnimatePresence` | Navigation dashboard |
| Counter animation | Framer Motion `useMotionValue` + `useTransform` | KPI analytics |
| Cursor custom | CSS + JS tracking | Landing page |
| Glow border | CSS `box-shadow` animé | Boutons hover |
| Skeleton loading | Shadcn Skeleton + pulse animation | Chargement données |
| Toast notifications | Sonner | Feedback actions |

### 5.7 Pages de l'application

| Page | Description |
|---|---|
| **Landing page** | Hero 3D, features bento, demo interactive, testimonials, CTA — full GSAP + Three.js |
| **Auth** | Login / Register — centré, minimal, transitions smooth entre les deux forms |
| **Dashboard / Éditeur** | Split view, dark mode, drag & drop, preview live, auto-save |
| **Analytics** | Cards KPI animées + graphique Recharts + tableau des liens par CTR |
| **Page publique** | Page link-in-bio — mobile-first, CSS-only animations, ultra rapide |
| **Settings** | Username, email, mot de passe, danger zone (suppression) |

---

## 6. User Flows

### 6.1 Onboarding (nouveau user)

```
Landing (scroll les features, joue avec la demo)
  → Click CTA "Create your page" (magnetic button)
    → Page auth avec transition smooth
      → Register (email + password)
        → Choisir un username (vérification dispo en temps réel, feedback micro-animation)
          → Choisir un thème de base (preview animée de chaque thème)
            → Éditeur : ajouter ses premiers liens
              → Preview live → Publish (confetti animation 🎉)
                → Modal partage : URL + QR Code + copier le lien
```

### 6.2 Édition quotidienne

```
Login → Dashboard/Éditeur (page transition smooth)
  → Ajouter / modifier / supprimer des blocs (drag & drop fluide)
    → Réorganiser par drag & drop (feedback visuel: ombre, slot animé)
      → Modifier le thème / couleurs (preview live instantanée)
        → Auto-save (indicateur "Saved ✓" discret)
```

### 6.3 Consultation analytics

```
Login → Onglet Analytics (transition slide)
  → Voir les KPIs (counter animation au chargement)
    → Filtrer par période (7j / 30j / all time) → graphique re-animé
      → Hover sur le graphique → tooltip smooth
        → Identifier les liens les plus performants → highlight dans le tableau
```

---

## 7. Roadmap

### Phase 1 — MVP (Semaine 1-2)

- Setup Next.js 14 + Tailwind + Shadcn/UI
- Setup Express + Prisma + PostgreSQL (Docker)
- Auth email/password (JWT + refresh tokens + bcrypt)
- Config Dokploy : services front + API + DB, domaines `linkf.vgtray.fr` + `api.linkf.vgtray.fr`, SSL auto
- Éditeur basique (ajout de liens, titre, bio) avec preview live
- 3 thèmes de base
- Page publique fonctionnelle (SSR)
- Deploy via Dokploy auto-deploy on push
- Smooth scroll (Lenis) sur le dashboard

### Phase 2 — Polish & Animations (Semaine 3)

- Landing page complète avec hero Three.js + GSAP scroll animations
- Drag & drop complet (dnd-kit)
- Customisation avancée (couleurs, fonts, spacing)
- Analytics basiques (vues + clics) avec counter animations
- Upload avatars/images (Multer → volume Docker persistant)
- QR Code generation
- SEO meta tags auto-générés
- Page transitions Framer Motion
- Boutons magnétiques + spotlight effects

### Phase 3 — Growth (Semaine 4+)

- Bloc embed (YouTube, Spotify)
- Demo interactive sur la landing
- Export QR en SVG
- Mode "maintenance" pour la page
- Rate limiting avancé + protection anti-abuse
- Backup automatique PostgreSQL (Dokploy scheduled backups)
- Testimonials carousel
- Performance audit (Lighthouse 95+)

---

## 8. Métriques de Succès

| Métrique | Objectif MVP | Objectif 3 mois |
|---|---|---|
| Pages créées | 10 | 100+ |
| Taux de complétion onboarding | > 60% | > 75% |
| Temps moyen de création d'une page | < 5 min | < 3 min |
| Page load time (publique) | < 1.5s | < 800ms |
| Lighthouse score (landing) | > 85 | > 95 |
| Lighthouse score (page publique) | > 95 | > 98 |

---

## 9. Risques & Mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Username squatting | Moyen | Limiter à 1 page par compte, policy de réclamation |
| Abus (liens malveillants) | Haut | Blacklist de domaines, report button sur les pages |
| Performance analytics | Moyen | Agrégation en batch, pas de tracking temps réel |
| Concurrence Linktree | Bas | Se différencier par le design premium et la customisation |
| Performance landing (Three.js lourd) | Moyen | Lazy load la scène 3D, fallback gradient pour mobile/low-end, `<Suspense>` |
| Bundle size (GSAP + Three.js) | Moyen | Tree-shaking, dynamic imports, split chunks par route |

---

## 10. Décisions Prises

| Décision | Choix | Raison |
|---|---|---|
| **Hébergement** | VPS personnel + Dokploy | PaaS self-hosted, Docker, auto-deploy, SSL auto |
| **Domaine** | `linkf.vgtray.fr` | Sous-domaine du portfolio, cohérent avec l'écosystème |
| **Auth** | Email/password + JWT | Simple, fiable, pas de dépendance OAuth pour le MVP |
| **BDD** | PostgreSQL self-hosted + Prisma | Type-safe, migrations, full contrôle des données |
| **Storage** | Filesystem VPS + Nginx static | Rapide, simple, pas besoin d'un S3 pour le MVP |
| **CI/CD** | GitHub Actions → SSH → PM2 | Pipeline simple, zero downtime reload |

## 11. Points de Discussion Restants

> À valider avant de commencer le développement :

1. **Monétisation** — Free tier illimité ? Freemium avec features premium ?
2. **Bloc prioritaire** — On commence avec quels types de blocs dans le MVP ?
3. **Limites upload** — Taille max des avatars/images ? (suggestion : 2MB)
4. **Backup** — Fréquence des pg_dump ? (suggestion : daily cron)

---

*Document généré pour le portfolio d'Adam Hnaien — Projet LinkForge*
