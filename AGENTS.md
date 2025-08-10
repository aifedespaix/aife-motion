# AGENTS.md

> **But** : guider l’IA de code (Codex) pour générer du code Motion Canvas propre, cohérent et réutilisable **avec une structure simple où tout est dans `src/`**.

---

## 1) Contexte

- **Tech** : Motion Canvas (`@motion-canvas/core`, `@motion-canvas/2d`) + TypeScript strict.
- **Rendu** : aperçu via Vite en dev, export vidéo via FFmpeg.
- **Runtime** : Bun pour le dev rapide possible, Node.js recommandé pour le rendu final.

---

## 2) Structure du projet (src-only)

```
project-root/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts           # configuration Vite
└─ src/
   ├─ projects/             # un fichier par projet Motion Canvas (ex: intro.project.ts)
   ├─ scenes/               # 1 scène = 1 fichier *.scene.ts(x)
   ├─ utils/                # fonctions d’animation réutilisables
   ├─ components/           # composants 2D réutilisables (boutons, labels...)
   └─ theme.ts              # thème global (couleurs, polices, timings, styles)
```

**Règles**

- Scènes → `src/scenes/`, importées par les fichiers projet dans `src/projects/`.
- Chaque projet Motion Canvas est un fichier dans `src/projects/` qui déclare ses scènes.
- Utilitaires → `src/utils/`
- Composants → `src/components/`
- Styles globaux → `src/theme.ts`

---

## 3) Bonnes pratiques

**Code & Typage**

- TypeScript strict.
- Utiliser `createRef<T>()` pour le typage.
- Éviter les casts hasardeux.

**Architecture**

- 1 scène par fichier.
- 1 projet par fichier dans `src/projects/`, listant ses scènes.
- Données séparées de la logique.
- Centraliser couleurs, polices, timings et styles globaux dans `theme.ts`.

**Animation**

- `all()` pour exécuter en parallèle, `sequence()` pour échelonner.
- `Layout`/`Stack` pour les alignements.
- Utiliser les signals (`fontSize()`, `fill()`).

**Rendu**

- Tester en dev avant `render`.
- Installer FFmpeg globalement.
- Si Bun pose problème en rendu, utiliser Node.

---

## 4) Thème global (`src/theme.ts`)

```ts
// src/theme.ts
export const theme = {
  font: "JetBrains Mono, Fira Code, monospace",
  colors: {
    bg: "#0b0f14",
    text: "#e6edf3",
    accent: "#ff5964",
    dim: "#92a2b4",
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
  },
  timing: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    stagger: 0.08,
  },
  sizes: {
    padding: 16,
    borderRadius: 8,
  },
  shadows: {
    soft: "#0004",
    strong: "#0008",
  },
};
```

---

## 5) Utilisation des composants (`src/components/`)

- Composants stateless et paramétrables.
- Respecter le thème global.

---

## 6) Checklist pour Codex

- Créer les nouvelles scènes dans `src/scenes/`.
- Créer un nouveau fichier projet dans `src/projects/` pour regrouper les scènes correspondantes.
- Les utilitaires dans `src/utils/`.
- Les composants 2D réutilisables dans `src/components/`.
- Respecter le thème global.
- Éviter les valeurs magiques.
- Fournir un exemple d’utilisation si ajout d’un nouvel utilitaire ou composant.

---

## 7) Erreurs courantes à éviter

- `computedFontSize()` / `computedFill()` n’existent pas → utiliser `fontSize()` / `fill()`.
- Cast direct après `.add()` → utiliser `createRef`.
- Positionner un curseur manuellement avec `x()` absolu → utiliser `Layout`.
- Disperser les styles au lieu d’utiliser `theme.ts`.

---

## 8) Qualité attendue

- Code lisible, commenté si nécessaire.
- Pas de dépendances inutiles.
- Respect du style global.
- Fonctions pures et paramétrables.
