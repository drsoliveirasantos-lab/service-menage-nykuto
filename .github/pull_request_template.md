## Objectif

Décrire clairement pourquoi cette PR existe : bug corrigé, amélioration, workflow, contenu, SEO, formulaire, mobile ou préparation production.

## Ajouté / Modifié

- 
- 
- 

## Règle GitHub respectée

- [ ] Un seul workflow principal `site-tests.yml` est utilisé pour la validation complète.
- [ ] Aucun workflow debug parallèle n’a été ajouté.
- [ ] Les tests sont regroupés en jobs séparés dans le workflow consolidé.
- [ ] Les runs automatiques restent limités à `preview` et aux PR vers `preview`.
- [ ] `main` n’est pas utilisé pour lancer les tests automatiques.
- [ ] `main` n’a pas été modifié directement pour une correction de site, sauf validation explicite.

## Tests / Statut CI

Cocher ou compléter après exécution du workflow `Site tests` :

- [ ] Run 1 — Static site validation
- [ ] Run 2 — Static SEO and content sanity
- [ ] Run 3 — Browser smoke tests
- [ ] Run 4 — Browser navigation and service links
- [ ] Run 5 — Browser mobile menu tests
- [ ] Run 6 — Browser forms and WhatsApp messages
- [ ] Run 7 — Browser contact CTA tests

Résumé du résultat :

```text
À compléter : vert / rouge / exception documentée.
```

## Vérifications avant merge

- [ ] Les changements ont été validés sur `preview`.
- [ ] Les fichiers touchés correspondent bien à l’objectif de la PR.
- [ ] Les placeholders, faux contacts ou anciennes marques ne sont pas réintroduits.
- [ ] Les formulaires et liens WhatsApp restent fonctionnels.
- [ ] La PR décrit clairement les modifications.
- [ ] Les exceptions éventuelles sont documentées.

## Notes

Ajouter ici toute décision importante : numéro provisoire WhatsApp, limite connue, changement à ne pas publier encore, ou validation visuelle nécessaire.
