# Document Technique

## Vue d'ensemble
L'objectif de ce test était de construire une interface simple et fiable pour la gestion des candidatures, en respectant le brief et en consommant uniquement les données via JSON Server.

J'ai volontairement choisi une approche simple: faire correctement les fonctionnalites principales avant de partir sur des bonus plus avances. Mon objectif etait surtout d'avoir un projet propre, lisible, et facile a expliquer.

## Choix d'architecture

### Vue 3 + Vite + TypeScript
- `Vue 3` a ete choisi parce que c'etait le framework demande pour le test.
- `Vite` m'a permis d'avoir un setup rapide et simple a lancer.
- `TypeScript` m'a aide a garder une structure de donnees claire pour ce qui vient de `db.json`, surtout dans les stores, les props et la couche API.

### Separation par couches
J'ai essaye d'organiser le projet de maniere simple:
- `views` pour les pages principales
- `components` pour les blocs UI reutilisables
- `stores` pour l'etat global et les actions async
- `services/api` pour les appels HTTP

Le flow principal est le suivant:

`user action -> view -> store -> API service -> JSON Server -> store -> UI`

Cette separation m'a aide a ne pas melanger le rendu, la logique d'etat et les requetes reseau dans les memes fichiers.

### Pinia pour le state management
J'ai utilise `Pinia` parce que le test demandait une vraie gestion d'etat, meme sur un petit projet.

Le store principal centralise:
- la liste des candidatures
- la candidature selectionnee
- les filtres actifs
- les etats de chargement
- les messages d'erreur et de succes

J'ai aussi separe les donnees de reference (`statuts`, `postes`) dans un store dedie pour eviter de tout mettre dans le meme endroit.

### Route dediee pour le detail
Pour le detail d'une candidature, j'ai choisi une page dediee avec `Vue Router` plutot qu'une modal.

Ce choix rend la navigation plus naturelle:
- l'URL est partageable
- le bouton retour du navigateur fonctionne normalement
- la page detail reste plus simple a comprendre si on veut la faire evoluer plus tard

## Gestion de l'API

### Principe general
L'application lit et modifie les donnees uniquement via JSON Server. Aucune candidature n'est codee en dur dans le front.

Les appels sont centralises dans `app/src/services/api`:
- `client.ts` contient la base commune
- `candidatures.ts` gere les endpoints metier lies aux candidatures
- `referenceData.ts` gere les listes de reference

### Shared HTTP layer
Dans `client.ts`, j'ai centralise:
- la `base URL`
- la construction des query params
- la fonction `request()`
- la gestion des erreurs via une classe `ApiError`

Cela m'a permis d'eviter de refaire le meme `fetch()` dans plusieurs composants, et de garder une logique reseau plus claire.

### Recuperation des donnees
La liste principale utilise les query params de JSON Server pour rester alignee avec le brief:
- recherche avec `q`
- filtre par `statut`
- filtre par `poste`
- filtre de date avec `dateCandidature_gte`
- pagination avec `_page` et `_limit`
- tri avec `_sort` et `_order`

Le nombre total de resultats est lu depuis le header `X-Total-Count`, ce qui permet de calculer la pagination cote front sans inventer une logique supplementaire.

### Synchronisation avec le state
Les `views` ne font pas directement les appels HTTP. Elles declenchent des actions de store, et les stores appellent ensuite les fonctions de la couche API.

Ce choix permet:
- de garder les composants plus simples
- de mieux suivre les loading states
- de centraliser les erreurs reseau
- de rendre le comportement plus facile a suivre

### Persistance des filtres
Les filtres sont persistes dans le `localStorage` afin de conserver un comportement plus realiste pour un dashboard. Cela permet a l'utilisateur de retrouver son contexte apres un refresh sans ajouter une complexite excessive.

## Gestion des erreurs et des etats
J'ai ajoute des etats explicites pour les cas importants:
- chargement de la liste
- chargement du detail
- erreur sur les donnees de reference
- erreur sur la liste
- erreur ou succes apres une mutation

L'interface affiche aussi des `retry actions` sur les erreurs principales afin de ne pas bloquer inutilement l'utilisateur.

## Difficultes rencontrees

### 1. Difference entre le comportement attendu et la version de JSON Server
La principale difficulte a ete de verifier que le comportement reel de JSON Server correspondait bien a ce qui etait attendu dans le test.

Au depart, il y avait un risque de decalage sur:
- la structure des reponses
- le comportement de la recherche
- la pagination et les metadonnees

La solution a ete d'utiliser une version stable de `json-server` (`0.17.x`) pour retrouver un comportement coherent avec le brief et avec les query params utilises dans l'application.

### 2. Gestion des commentaires dans la structure de donnees fournie
Dans `db.json`, les commentaires sont stockes a l'interieur d'une candidature, et non comme une ressource separee.

Concretement, cela veut dire que pour ajouter un commentaire, il ne suffit pas d'appeler un endpoint dedie. Il faut:
- lire la candidature courante
- reconstruire le tableau `commentaires`
- envoyer un `PATCH` sur la candidature complete avec le nouveau tableau

Cette contrainte venait surtout de la structure du mock API, et non d'un probleme de composant. J'ai donc adapte la logique front a cette structure pour rester compatible avec le dataset du test.

## Trade-offs et limites
J'ai volontairement laisse de cote certains bonus comme les tests, le dark mode, les animations ou l'optimistic UI.

Le but n'etait pas de faire un projet trop charge, mais de livrer un coeur fonctionnel propre:
- liste
- filtres
- recherche
- pagination
- detail
- mise a jour du statut
- ajout de commentaire

Dans le contexte d'un test time-boxed, j'ai prefere une implementation complete et coherente plutot qu'une accumulation de features partielles.

## Ameliorations possibles
Avec plus de temps, j'ajouterais en priorite:
- des tests cibles sur les stores et la couche API
- un feedback utilisateur plus riche apres les mutations
- une passe supplementaire sur l'accessibilite
- des options de tri ou de cache plus poussees
