---
title: Robotique
lang: fr
---

Curieux et passionné de robotique, j'ai participé à de nombreux projets R&D.

Je sais apporter et mettre en oeuvre des solutions concrètes et fiables
pour résoudre les défis de la robotique mobile en milieu ouvert.

## Ecorobotix (2020-2022)

J'ai travaillé sur les machines Ecorobotix :

* AVO, un robot autonome qui fournit un sprayage intelligent ultra-écologique
* ARA, un sprayeur ultra-haute précision qui permet une application ultra-précise
d'herbicide, de fongicides, d'insecticide et d'engrais

Ma mission consistait à spécifier et implémenter le __module de localisation__ de ces deux machines.

Le défi était de mettre au point un __algorithme de fusion de capteurs__ avec les caractéristiques suivantes :

* accepter des __capteurs hétérogènes__ (GPS et odométrie visuelle prise depuis plusieurs endroits sur la machine)
* accepter un __échantillonnage irrégulier__ (fréquences différentes selon les capteurs et délais arbitraires de réception)
* accepter des __mesures manquantes ou erronnées__
* s'exécuter en embarqué sur la machine, en utilisant le moins de CPU possible
* fournir une __prédiction temps réel__ (prédire la trajectoire future d'une plante détectée dans le passé)
* avec une __précision de quelques centimètres__

Mon travail a non seulement permis de __répondre à toutes ces contraintes__,
mais je l'ai surtout réalisé d'une manière robuste et fiable :
__aucun bug n'a été découvert__ sur ce module logiciel pendant ma dernière année chez Ecorobotix.

## Tornado (2019)

J'ai contribué au projet Tornado pour l'Institut Pascal.

Ma mission consistait à adapter un véhicule autonome
pour démontrer des fonctionnalités innovantes en milieu urbain :

* __positionnement de robot__ par odométrie visuelle
* __contrôle de trajectoire__ pour une navigation précise
* communication entre les véhicules et l'infrastructure
* interaction intelligente avec les autres usager (piétons, cyclistes, automobilistes, etc.)
* système de gestion de flotte de véhicules hétérogènes

Basé sur le framework robotique développé par l'équipe en __C++ sous ROS__,
j'ai développé une interface utilisateur pour répondre aux besoins de ce démonstrateur.

## Baudet-Rob (2018-2019)

Aroco est une __plateforme robotique autonome tout terrain__
développée par l'unité de recherche [TSCF](https://tscf.clermont.hub.inrae.fr/) à l'IRSTEA (maintenant INRAE).

![Aroco robot ([origine de l'image](https://www.agrotechnopole.fr/nos-moyens/robotique-agricole-et-mobilite-off-road/))](images/aroco.jpg)

Je suis intervenu dans la finalisation d'un projet de recherche
consistant à localiser le robot en environnement extérieur en utilisant un radar panoramique :

* implementation en __C++ sous ROS__ d'algorithmes de recherche innovants
(filtre antispeckle, localisation et suivi par correlation d'images radar)
* utilisation et amélioration du framework robotique développé par l'équipe
(fusion de capteurs, loi de contrôle, outils de configuration)
* développement d'un __démonstrateur fonctionnel__ basé sur le robot Aroco

À la fin de ma mission, le robot était __effectivement capable de démontrer__ :

* la __localisation temps réel__ en utilisant le radar (sans GPS)
* l'enregistrement et le suivi de trajectoire avec une répétabilité __< 10 cm__
* en utilisant uniquement le __logiciel embarqué autonome__ sur le robot

![Vue satellite à gauche / carte radar à droite (images extraites de la [publication scientifique](https://www.researchgate.net/publication/336133596_Robot_Localization_and_Navigation_with_a_Ground-_Based_Microwave_Radar))](images/radar_map.jpg)
