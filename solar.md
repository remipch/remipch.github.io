---
title: Solar concentrator
lang: en
---

In 2023 and 2024 I designed and built a solar concentrator:

* original [mechanical design](https://github.com/remipch/solar_concentrator/blob/master/mechanics/README.md)
* development of a specific [electronic board](https://github.com/remipch/solar_concentrator/blob/master/electronics/README.md)
* embedded software on an [ESP32-CAM](https://www.gotronic.fr/art-module-esp32-cam-32630.htm) module

This project is open-source and documented in detail [here](https://github.com/remipch/solar_concentrator).

![Orientable panel ([clic here](https://remipch.github.io/solar_concentrator/view_3d.html?model=solar_panel_assembled) to open the 3D model)](images/solar_concentrator.png)

One of the challenges of this project was to embed all the algorithms on a low-cost microcontroller board:

* Processor: ESP32 at 240 MHz
* RAM: 520 Kb + 4 Mb (PSRAM)
* Camera sensor: OV2640
* Price: 12€

All the code was successfully implemented on this platform:

* high-level application logic
* user interface (embedded http server accessible via WiFi)
* image acquisition and processing
* motor regulation and control

![Prototype of the orientable panel with the supervisor](images/solar_concentrator.jpg)
