---
title: Concentrateur solaire
lang: fr
---

En 2023 et 2024 j'ai conçu et réalisé un concentrateur solaire :

* [design mécanique](https://github.com/remipch/solar_concentrator/blob/master/mechanics/README.md) original
* développement d'une [carte électronique](https://github.com/remipch/solar_concentrator/blob/master/electronics/README.md) spécifique
* logiciel embarqué sur un module [ESP32-CAM](https://www.gotronic.fr/art-module-esp32-cam-32630.htm)

![Panneau orientable ([cliquez ici](https://remipch.github.io/solar_concentrator/view_3d.html?model=solar_panel_assembled) pour ouvrir le modèle 3D)](images/solar_concentrator.png)

Ce projet est open-source et documenté en détail sur mon dépôt
[solar_concentrator](https://github.com/remipch/solar_concentrator).

Un des défis de ce projet était d'embarquer la totalité des algorithmes
sur une carte microcontrôleur économique :

* Processeur : ESP32 à 240 MHz
* RAM : 520 Ko + 4 Mo (PSRAM)
* Capteur caméra : OV2640
* Prix : 12 €

La totalité du code a pu être implémenté sur cette plateforme :

* logique haut niveau de l'application
* interface utilisateur (serveur http embarqué accessible par Wifi)
* acquisition et traitement d'images
* régulation et commande des moteurs

![Panneau orientable avec le superviseur](images/solar_concentrator.jpg)
