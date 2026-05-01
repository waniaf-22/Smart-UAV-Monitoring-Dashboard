# Smart UAV Monitoring Dashboard

A high-fidelity Figma prototype for a ground control station (GCS) interface designed to monitor unmanned aerial vehicles (UAVs) in real time — built for the HCI course at NUCES FAST.

![Figma](https://img.shields.io/badge/Tool-Figma-blue)
![HCI](https://img.shields.io/badge/Course-Advanced%20HCI-purple)
![University](https://img.shields.io/badge/NUCES-FAST%202025-gray)

---

## Overview

Existing GCS tools like QGroundControl are built for expert pilots and overwhelm non-specialist operators with dense, unstructured data. This dashboard applies systematic HCI principles to produce a clean, safety-conscious interface that reduces cognitive load and prevents critical errors.

The design was evaluated against **Nielsen's 10 Usability Heuristics** and **Shneiderman's 8 Golden Rules**, with two full iteration cycles informed by heuristic evaluation and a colour-blindness accessibility audit.

---

## Team
Wania Fatima
Sameer Rajani
---

## Live Prototype

> View the interactive prototype on Figma — all 12 screens and 4 user flows are fully linked.

**[Figma Prototype Link →](YOUR_FIGMA_LINK_HERE)**

---

## Screens (12 total)

| # | Screen | Description |
|---|--------|-------------|
| 01 | Login / Auth | Role-based access (Pilot / Supervisor) |
| 02 | Pre-flight Checklist | Safety gates before launch |
| 03 | Main Dashboard | Four-quadrant live monitoring view |
| 04 | Mission Planning Map | Drag-and-drop waypoints, geo-fence config |
| 05 | Telemetry Detail | IMU, altimeter, GPS accuracy, motor RPM |
| 06 | Alert Management | Tri-tier alert log (Critical / Warning / Info) |
| 07 | Video Fullscreen | Multi-camera feed with minimal HUD |
| 08 | Multi-Drone Overview | Fleet status tiles for supervisors |
| 09 | Flight Log & Analytics | Sortable logs, trend graphs, PDF export |
| 10 | Settings | Thresholds, units, language, dark/light theme |
| 11 | Onboarding Tour | First-launch guided walkthrough |
| 12 | Post-Flight Summary | KPIs, anomaly flags, archive/share |

---

## Key Design Decisions

| HCI Principle | Feature Applied |
|---------------|-----------------|
| Visibility of system status | Persistent telemetry bar — GPS, battery, RSSI, altitude always visible |
| Error prevention | Pre-flight checklist gates launch; geo-fence boundary warnings |
| User control & freedom | Return-to-Home button + waypoint undo stack always accessible |
| Minimalist design | Dark theme (`#0D1B2A` base); non-critical data behind collapsible panels |
| Universal usability | WCAG 2.1 AA contrast; shape + colour encoding for alerts (deuteranopia-safe) |
| Easy reversal of actions | Full undo/redo stack on mission planning map |

---

## Repository Structure

```
AHCI-PROJECT/
├── report/
│   └── UAV_HCI_Semester_Report.docx
├── assets/
│   ├── screenshots/
│   └── design-system/
├── wireframes/
└── README.md
```

---

## Course

Aapplied Human-Computer Interaction · NUCES FAST University · Spring 2026
