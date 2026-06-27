# GitHub workflow notes

Cette note sert à ouvrir une PR de validation vers `preview`, dans le même esprit que la PR consolidée du dépôt Med Nykuto.

## Règle appliquée

- un seul workflow principal : `.github/workflows/site-tests.yml` ;
- jobs séparés dans un seul run lisible ;
- déclencheurs automatiques limités à `preview` et aux PR vers `preview` ;
- pas de run automatique sur `main` ;
- template de PR ajouté pour documenter les objectifs, les tests et les exceptions.

## Utilisation attendue

Pour les prochains changements importants :

1. créer une branche courte depuis `preview` ;
2. faire les modifications sur cette branche ;
3. ouvrir une PR vers `preview` ;
4. laisser le workflow `Site tests` tourner ;
5. merger vers `preview` après validation ;
6. ouvrir une PR `preview → main` seulement quand la mise en production est explicitement validée.
