# Consignes de travail — Service Ménage Nykuto

Ce dépôt doit être géré avec la même discipline que Med Nykuto.

## Branches

- `preview` = développement, corrections, tests et validation visuelle.
- `main` = production uniquement.
- Avant toute mise à jour importante de `main`, créer une branche de sauvegarde : `backup-main-YYYYMMDD`.

## Règle principale

Ne jamais modifier `main` directement pour une correction de site, sauf urgence explicitement validée par le propriétaire du dépôt.

Workflow recommandé :

1. Corriger sur `preview` ou sur une branche courte ciblant `preview`.
2. Tester sur `preview`.
3. Créer ou mettre à jour une issue GitHub qui décrit le bug ou l'amélioration.
4. Ouvrir une PR vers `preview` pour les changements techniques, CI ou tests qui doivent être relus avant intégration.
5. Ouvrir une PR `preview → main` uniquement quand la correction est validée et que la mise en production est explicitement demandée.
6. Comparer `preview` et `main` avant merge.
7. Sauvegarder `main` avant tout alignement forcé.
8. Ne publier en production que si les contrôles essentiels sont OK.

## Pull requests

Les PR doivent suivre le même format documentaire que Med Nykuto :

- `## Objectif` : pourquoi la PR existe.
- `## Ajouté / Modifié` : liste claire des changements.
- `## Règle GitHub respectée` : confirmer que le workflow reste consolidé et que `main` n'est pas utilisé pour les tests automatiques.
- `## Tests / Statut CI` : état des runs du workflow `Site tests`.
- `## Vérifications avant merge` : éléments validés avant intégration.
- `## Notes` : limites, exceptions ou validations visuelles à faire.

Règles PR obligatoires :

- Les PR de développement doivent cibler `preview`.
- Les PR vers `main` sont réservées à la production et ne doivent être ouvertes qu'après validation explicite.
- Ne pas ajouter de workflow parallèle dans une PR si `site-tests.yml` couvre déjà le besoin.
- Ne pas mélanger correction UI, changement légal, changement de workflow et contenu commercial dans une même PR si ce n'est pas nécessaire.
- Chaque PR doit indiquer clairement si elle modifie seulement les tests, seulement le site, ou les deux.
- Les exceptions doivent être documentées dans la PR, pas seulement dans le chat.

## Règle GitHub Actions — un seul workflow consolidé

Ne pas lancer plusieurs workflows séparés pour tester la même correction.

Règle obligatoire :

- Utiliser un seul workflow principal pour une validation complète : `.github/workflows/site-tests.yml`.
- Regrouper tous les tests nécessaires dans ce workflow unique sous forme de jobs séparés.
- Ne pas créer de workflows debug parallèles qui se déclenchent sur le même commit si le workflow principal couvre déjà le besoin.
- Ne pas déclencher plusieurs commits de test successifs avant que le run précédent ait livré ses résultats, sauf correction urgente d'un échec déjà diagnostiqué.
- Préférer ajouter un job au workflow principal plutôt que créer un nouveau workflow.
- Le `concurrency` doit éviter les annulations inutiles. Pour les runs de validation, préférer `cancel-in-progress: false`, sauf cas explicitement voulu.
- Les déclencheurs automatiques doivent rester limités à `push` sur `preview` et `pull_request` vers `preview`.
- Ne pas déclencher automatiquement le workflow sur `main`.

Objectif : un commit important doit produire un seul run lisible avec tous les jobs nécessaires, au lieu de plusieurs runs qui s'annulent ou se concurrencent.

## Qualité des corrections

- Corriger la cause exacte, pas ajouter des rustines inutiles.
- Modifier le plus petit bloc responsable possible.
- Ne pas supprimer de contenu métier sans confirmation.
- Ne pas remplacer massivement des fichiers si une correction ciblée suffit.
- Pour un bug UI, corriger le HTML/CSS/JS responsable et vérifier le comportement réel.

## Tests minimaux avant production

Vérifier au minimum :

- navigation principale ;
- boutons WhatsApp ;
- formulaire de devis ;
- liens entre pages ;
- affichage mobile ;
- absence de contenu placeholder avant publication ;
- mentions légales et confidentialité si le site est public.

## Issues GitHub

Créer une issue pour chaque chantier réel :

- bug UI ;
- problème mobile ;
- problème formulaire ;
- SEO / contenu ;
- déploiement / production ;
- sécurité ou données personnelles.

Chaque issue doit contenir :

- le problème observé ;
- le résultat attendu ;
- les fichiers probablement concernés ;
- les critères d'acceptation ;
- le statut des tests.

## Mise en production

Avant de mettre à jour `main`, confirmer :

- `preview` est validé visuellement ;
- les changements sont compris ;
- une sauvegarde de `main` existe si le changement est important ;
- la PR ou le commit décrit clairement les modifications ;
- le workflow principal complet est vert ou les exceptions sont explicitement documentées.