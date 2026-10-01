# Todo para tu mascota — Premium V2

Intégration Astro + React de la maquette fournie, sans changement de composition.
Les photos et les huit fichiers de polices sont locaux dans `public/assets`.
Le fichier original est conservé : `todo-mascota-premium-v2.html`.
Sa copie consultable se trouve à `/reference/index.html` pour la comparaison.

## Lancer

```sh
npm ci
npm run dev
```

Ouvrir http://localhost:4321.

```sh
npm run build
npm run preview
```

La sortie statique prête à héberger se trouve dans `dist/`.

## Vérifier

```sh
npx playwright install chromium
npm test
```

Les tests comparent des captures complètes avec la référence à 1440, 1024,
736, 390 et 320 px, les dimensions des sections, les images, les polices,
l’absence de débordement, et les principaux parcours interactifs.
Les captures sont générées dans `artifacts/` (non versionné).
Sur macOS, Chrome installé est utilisé si disponible ; sinon Playwright utilise Chromium.

Validation : build réussi et sept tests réussis. Les cinq comparaisons visuelles
ne présentent aucun pixel différent au seuil perceptuel 0,1 ; les dimensions
des sections sont identiques à celles de la référence.

## Structure

- `src/pages/index.astro` : document et métadonnées espagnoles.
- `src/components/PremiumExperience.jsx` : composants de la composition V2.
- `src/styles/style.css` : styles et breakpoints extraits de la référence.
- `src/lib/app.js` : interactions de référence, exécutées par le composant React.
- `src/lib/reference-markup.json` : contenu original, séparé par section.
- `scripts/extract-reference.py` : extraction reproductible des ressources.

## Démonstration

Les six univers, les favoris, le profil, le parcours en trois étapes,
les détails, la checklist, le menu mobile et Olivia fonctionnent localement.
Les demandes produisent uniquement un résumé : aucun envoi, aucune réservation,
aucun paiement et aucune connexion IA. Profil et favoris restent en mémoire
pendant la session de la page. Les prestataires, tarifs, coordonnées et
intégrations définitives ne sont pas encore fournis.
