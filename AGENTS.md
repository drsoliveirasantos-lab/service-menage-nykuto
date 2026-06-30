# Consignes IA — Service Ménage Nykuto

Ce dépôt doit être géré avec le même standard que Med Nykuto : workflow strict, sources claires, PR vérifiables et nettoyage régulier.

## Lecture obligatoire

Avant toute modification, lire dans cet ordre :

1. `SOURCE_OF_TRUTH.md`
2. `AGENTS.md`
3. `.github/copilot-instructions.md`
4. `docs/site-architecture.md`
5. `.github/pull_request_template.md` s'il existe

Ne pas modifier en devinant. Identifier d'abord la source officielle puis faire le plus petit changement sûr.

## Branches et PR

- `main` = production.
- `preview` = validation si la branche existe.
- Sinon, créer une branche courte depuis `main` et ouvrir une PR.
- Ne jamais modifier `main` directement pour une correction normale.
- Ne pas merger si les checks sont rouges ou en attente.
- Ne pas supprimer de fichiers, branches, workflows ou données sans validation explicite.

## Organisation attendue

- Code éditable : `src/`, fichiers HTML/CSS/JS racine, ou structure déclarée dans `SOURCE_OF_TRUTH.md`.
- Ressources publiques : `public/`, `assets/`, `images/`.
- Documentation : `docs/`.
- Workflows et consignes GitHub : `.github/`.
- Scripts de validation/maintenance : `scripts/`.

## Hygiène repository

Ne pas introduire :

- archives `.zip`, `.rar`, `.7z`, `.tar`, `.tgz`, `.gz` ;
- fichiers `tmp`, `temp`, `old`, `copy`, `backup`, `legacy`, `obsolete` sans justification ;
- workflows de debug laissés en place ;
- fichiers générés ou copiés qui peuvent être confondus avec la source officielle.

## Validation

Pour un changement structurel, lancer ou laisser la CI lancer :

```bash
node scripts/validate-repository-hygiene.js
```

Si un check échoue, corriger la cause avant de merger.
