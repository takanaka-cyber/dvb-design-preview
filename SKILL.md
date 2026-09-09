---
name: dvb-design
description: Use this skill to generate well-branded interfaces and assets for DVB (AXIS 社内の広告運用ダッシュボード), either for production (Next.js 16 / Tailwind v4 / shadcn) or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the readme.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key rules for DVB:
- Numbers first. One brand blue (`--primary`), color only for meaning (`--positive` / `--negative` / `--warning` / `--info`, rank and media labels). No per-screen header bands, no gradients, no emoji.
- One primary action per screen. Tables: `--muted` header, right-aligned tabular numerals, 13px minimum, 44px rows (36px compact), sticky header + first column.
- Paste `deliverables/globals.css` into `app/globals.css`; never alias tokens in `:root`; expose to Tailwind only through `@theme inline`.
- Component specs and states: `components/**` (21 parts incl. DraftRestoreBanner / FreshnessBadge / WeekSelector). Reference screens: `ui_kits/dvb/index.html` (PC 1440 / 1280, mobile 393 / 430). Migration order: `docs/migration.md` (土台 → 日報 → 案件別まとめ → 週次レポート → サイドバー).
- SaveStatus lives once in PageHeader's right end; unsaved input is parked in the browser and surfaced by DraftRestoreBanner; week is shown once via WeekSelector.
