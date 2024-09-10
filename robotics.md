---
title: Robotics
lang: en
---

Curious and passionate about robotics,
I've been involved in a number of innovative R&D projects.

I bring and implement concrete, reliable solutions
to the challenges of mobile robotics in open environments.

## Ecorobotix (2020-2022)

I've been working on [Ecorobotix](https://ecorobotix.com/en/) machines:

* AVO, an autonomous robot which offers smart and ultra-ecological spraying
* ARA, an ultra-high precision sprayer which enables the ultra-targeted application of herbicides,
fungicides, insecticides or fertilisers

I was in charge of specifying and implementing the __positioning software module__ for these machines.

The challenge was to develop a __sensor fusion algorithm__ with the following characteristics:

* accepting __heterogeneous sensor data__ (GPS and visual odometry measured from different locations on the machine)
* accepting __irregular sensor samplings__ (with different frequencies and potential arbitrary delays)
* accepting __missing or erroneous__ sensor data
* running embedded on the machine, using the lowest CPU resource possible
* providing __real-time prediction estimation__ (predict the future trajectory of a plant detected in the past)
* within a tolerance of a __few centimetres__

Not only my work allowed to __fulfill all these requirements__ but it was done in robust way:
during my last year at Ecorobotix, __no bugs were reported__ related to this positioning software module.

![AVO ([image origin](https://ecorobotix.com/fr/avo/))](images/avo.jpg)

![ARA ([image origin](https://ecorobotix.com/fr/ara/))](images/ara.jpg)

## Tornado (2019)

I've been working on project Tornado for
[PerSyst](http://www.institutpascal.uca.fr/index.php/en/persyst) team at Institut Pascal.

My mission was to adapt the EZ10 __autonomous shuttle__
to demonstrate innovative functionalities centered in urban areas:

* __robot positioning__ by visual odometry
* __trajectory control__ for accurate path navigation
* communication between vehicles and infrastructure
* intelligent interaction with other users (pedestrians, cyclists, motorists, etc.)
* management system for the fleet of heterogeneous vehicles

I used the existing robotic framework developed by the team in __C++ under ROS__
and developed a user interface on top of that to fulfill the needs of this demonstrator.

![EZ10 shuttle](images/ez10.jpg)

## Baudet-Rob (2018-2019)

Aroco is an __autonomous off-road robotics platform__
developped by [TSCF](https://tscf.clermont.hub.inrae.fr/) research unit at IRSTEA (now INRAE).

My work was to finalize a long-term research project to provide the robot
a way to locate itself in an external environment using a panoramic radar:

* implementation in __C++ under ROS__ of cutting-edge research algorithms
(antispeckle filter, __localization and tracking__ by radar images correlation)
* use and enhancement of the existing robotic framework developed by the team
(__multi-sensor data fusion__, control law, configuration tools)
* development of a __real demonstrator__ based on Aroco robot

At the end of my mission, the robot was __successfully able to demonstrate__:

* __real-time localization__ using the radar (without GPS)
* path recording and following with a repeatability __better than 10 cm__
* using __autonomous embedded software__ on the robot

![Aroco robot ([image origin](https://www.agrotechnopole.fr/nos-moyens/robotique-agricole-et-mobilite-off-road/))](images/aroco.jpg)

![Satellite view on the left / radar map on the right (images taken from the [conference paper](https://www.researchgate.net/publication/336133596_Robot_Localization_and_Navigation_with_a_Ground-_Based_Microwave_Radar))](images/radar_map.jpg)
