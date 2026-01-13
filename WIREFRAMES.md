# JordanList - Visual Wireframes

This document provides detailed ASCII wireframes for the redesigned JordanList application.

---

## HomePage - Desktop View (1280px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗ │
│  ║                    🏛️  JORDANLIST                                     ║ │
│  ║              Sistema de Gestión de Niños de Iglesia                   ║ │
│  ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  👥 Agregar Nuevo Niño                                                 │ │
│  │                                                                         │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │ │
│  │  │  [  Nombre  ] [  Apellido  ] [ Edad ]  [ + Agregar Niño ]       │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  👥 Listado de Niños                                                   │ │
│  │                                                                         │ │
│  │  ╔════════════════════════════════════════════════════════════════╗  │ │
│  │  ║ 👤 Nombre  │ Apellido  │ Edad      │ 🏆 Total Puntos │ Acciones ║  │ │
│  │  ╠════════════════════════════════════════════════════════════════╣  │ │
│  │  ║ Juan       │ Pérez     │ (8 años)  │   🏆 42         │ ✏️  🗑️   ║  │ │
│  │  ║ María      │ López     │ (10 años) │   🏆 38         │ ✏️  🗑️   ║  │ │
│  │  ║ Pedro      │ García    │ (7 años)  │   🏆 55         │ ✏️  🗑️   ║  │ │
│  │  ║ Ana        │ Martínez  │ (9 años)  │   🏆 29         │ ✏️  🗑️   ║  │ │
│  │  ║ Carlos     │ Rodríguez │ (11 años) │   🏆 47         │ ✏️  🗑️   ║  │ │
│  │  ╚════════════════════════════════════════════════════════════════╝  │ │
│  │                                                                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ──────────────────────────────────────────────────────────────────────── │
│             🏛️  Sistema de Puntos para Niños de Iglesia                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## HomePage - Mobile View (< 640px)

```
┌─────────────────────────┐
│                         │
│  ╔═══════════════════╗  │
│  ║   🏛️  JORDANLIST ║  │
│  ║     Sistema de    ║  │
│  ║  Gestión de Niños ║  │
│  ╚═══════════════════╝  │
│                         │
│  ┌───────────────────┐  │
│  │ 👥 Agregar Niño   │  │
│  │                   │  │
│  │  [ Nombre      ]  │  │
│  │  [ Apellido    ]  │  │
│  │  [ Edad        ]  │  │
│  │  [+ Agregar Niño] │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ 👥 Listado        │  │
│  │                   │  │
│  │ Scroll → → →      │  │
│  │ ┌──────────────┐  │  │
│  │ │Nombre│Edad│..│  │  │
│  │ ├──────────────┤  │  │
│  │ │Juan  │8   │42│  │  │
│  │ │María │10  │38│  │  │
│  │ │Pedro │7   │55│  │  │
│  │ └──────────────┘  │  │
│  └───────────────────┘  │
│                         │
│  ────────────────────   │
│  🏛️  Sistema Iglesia   │
└─────────────────────────┘
```

---

## EditPage - Desktop View (1280px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗ │
│  ║                    🏛️  JORDANLIST                                     ║ │
│  ║              Sistema de Gestión de Niños de Iglesia                   ║ │
│  ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                                                             │
│  ← Volver al Listado                                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  Juan Pérez                            ┌──────────────────┐            │ │
│  │  Edad: 8 años                          │  🏆 Total Puntos │            │ │
│  │                                        │      42          │            │ │
│  │                                        └──────────────────┘            │ │
│  │                                        [ Editar Info ]                 │ │
│  │                                                                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  🏆 Sistema de Puntos                                                  │ │
│  │                                                                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                │ │
│  │  │    📖    │ │    📜    │ │    💬    │ │    🔍    │                │ │
│  │  │          │ │          │ │          │ │          │                │ │
│  │  │  Traer   │ │Versículo │ │Particip. │ │ Búsqueda │                │ │
│  │  │  Biblia  │ │Memorizado│ │          │ │  Rápida  │                │ │
│  │  │          │ │          │ │          │ │          │                │ │
│  │  │ +2 pts   │ │ +2 pts   │ │ +1 pt    │ │ +2 pts   │                │ │
│  │  │ (12 pts) │ │ (8 pts)  │ │ (5 pts)  │ │ (10 pts) │                │ │
│  │  │          │ │          │ │          │ │          │                │ │
│  │  │ [-] [6]  │ │ [-] [4]  │ │ [-] [5]  │ │ [-] [5]  │                │ │
│  │  │     [+]  │ │     [+]  │ │     [+]  │ │     [+]  │                │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘                │ │
│  │                                                                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                │ │
│  │  │    👥    │ │    ❓    │ │    🕐    │ │    ❤️    │                │ │
│  │  │          │ │          │ │          │ │          │                │ │
│  │  │  Traer   │ │Responder │ │Asistencia│ │ Realizar │                │ │
│  │  │  Amigo   │ │Preguntas │ │ Puntual  │ │ Oración  │                │ │
│  │  │          │ │          │ │          │ │          │                │ │
│  │  │ +5 pts   │ │ +1 pt    │ │ +1 pt    │ │ +1 pt    │                │ │
│  │  │ (15 pts) │ │ (3 pts)  │ │ (7 pts)  │ │ (4 pts)  │                │ │
│  │  │          │ │          │ │          │ │          │                │ │
│  │  │ [-] [3]  │ │ [-] [3]  │ │ [-] [7]  │ │ [-] [4]  │                │ │
│  │  │     [+]  │ │     [+]  │ │     [+]  │ │     [+]  │                │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘                │ │
│  │                                                                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ──────────────────────────────────────────────────────────────────────── │
│             🏛️  Sistema de Puntos para Niños de Iglesia                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## EditPage - Tablet View (768px - 1024px)

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ╔══════════════════════════════════════════════════╗ │
│  ║            🏛️  JORDANLIST                        ║ │
│  ║     Sistema de Gestión de Niños de Iglesia       ║ │
│  ╚══════════════════════════════════════════════════╝ │
│                                                        │
│  ← Volver al Listado                                   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Juan Pérez              ┌────────────────┐      │ │
│  │  Edad: 8 años            │ 🏆 Total: 42   │      │ │
│  │                          └────────────────┘      │ │
│  │                          [ Editar Info ]         │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🏆 Sistema de Puntos                             │ │
│  │                                                    │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐            │ │
│  │  │   📖    │ │   📜    │ │   💬    │            │ │
│  │  │ Biblia  │ │Versículo│ │Particip.│            │ │
│  │  │ +2 pts  │ │ +2 pts  │ │ +1 pt   │            │ │
│  │  │(12 pts) │ │(8 pts)  │ │(5 pts)  │            │ │
│  │  │[-] [6]  │ │[-] [4]  │ │[-] [5]  │            │ │
│  │  │    [+]  │ │    [+]  │ │    [+]  │            │ │
│  │  └─────────┘ └─────────┘ └─────────┘            │ │
│  │                                                    │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐            │ │
│  │  │   🔍    │ │   👥    │ │   ❓    │            │ │
│  │  │ Búsqueda│ │  Amigo  │ │Preguntas│            │ │
│  │  │ +2 pts  │ │ +5 pts  │ │ +1 pt   │            │ │
│  │  │(10 pts) │ │(15 pts) │ │(3 pts)  │            │ │
│  │  │[-] [5]  │ │[-] [3]  │ │[-] [3]  │            │ │
│  │  │    [+]  │ │    [+]  │ │    [+]  │            │ │
│  │  └─────────┘ └─────────┘ └─────────┘            │ │
│  │                                                    │ │
│  │  ┌─────────┐ ┌─────────┐                         │ │
│  │  │   🕐    │ │   ❤️    │                         │ │
│  │  │Asistenc.│ │ Oración │                         │ │
│  │  │ +1 pt   │ │ +1 pt   │                         │ │
│  │  │(7 pts)  │ │(4 pts)  │                         │ │
│  │  │[-] [7]  │ │[-] [4]  │                         │ │
│  │  │    [+]  │ │    [+]  │                         │ │
│  │  └─────────┘ └─────────┘                         │ │
│  │                                                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ────────────────────────────────────────────────     │
│       🏛️  Sistema de Puntos para Niños               │
└────────────────────────────────────────────────────────┘
```

---

## EditPage - Mobile View (< 768px)

```
┌─────────────────────────┐
│                         │
│  ╔═══════════════════╗  │
│  ║   🏛️  JORDANLIST ║  │
│  ║     Sistema de    ║  │
│  ║  Gestión de Niños ║  │
│  ╚═══════════════════╝  │
│                         │
│  ← Volver               │
│                         │
│  ┌───────────────────┐  │
│  │ Juan Pérez        │  │
│  │ Edad: 8 años      │  │
│  │                   │  │
│  │   ┌───────────┐   │  │
│  │   │🏆 Total:42│   │  │
│  │   └───────────┘   │  │
│  │  [Editar Info]    │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ 🏆 Puntos         │  │
│  │                   │  │
│  │ ┌───────────────┐ │  │
│  │ │     📖        │ │  │
│  │ │ Traer Biblia  │ │  │
│  │ │ +2 pts        │ │  │
│  │ │   (12 pts)    │ │  │
│  │ │               │ │  │
│  │ │  [-] [6] [+]  │ │  │
│  │ └───────────────┘ │  │
│  │                   │  │
│  │ ┌───────────────┐ │  │
│  │ │     📜        │ │  │
│  │ │  Versículo    │ │  │
│  │ │ Memorizado    │ │  │
│  │ │ +2 pts        │ │  │
│  │ │   (8 pts)     │ │  │
│  │ │               │ │  │
│  │ │  [-] [4] [+]  │ │  │
│  │ └───────────────┘ │  │
│  │                   │  │
│  │ [... 6 more      │  │
│  │  cards below]     │  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  ────────────────────   │
│  🏛️  Sistema Iglesia   │
└─────────────────────────┘
```

---

## Activity Card Detail - All States

### Normal State
```
┌──────────────────────┐
│   📖 [Blue]          │  ← Colored icon background
│                      │
│ Traer la Biblia      │  ← Activity name
│                      │
│ +2 pts    (12 pts)   │  ← Points per action + total
│                      │
│  [-]  [6]  [+]      │  ← Remove | Count | Add
└──────────────────────┘
    ↑      ↑     ↑
   Red   Count  Blue
 Button         Gradient
```

### Hover State (Card)
```
┌──────────────────────┐
│   📖 [Brighter]      │  ← Icon glows
│                      │
│ Traer la Biblia      │  ← Scale: 105%
│                      │
│ +2 pts    (12 pts)   │  ← Shadow increases
│                      │
│  [-]  [6]  [+]      │  ← Border color changes
└──────────────────────┘
     ⬆ Card lifts up ⬆
```

### Hover State (Buttons)
```
┌──────────────────────┐
│   📖                 │
│                      │
│ Traer la Biblia      │
│                      │
│ +2 pts    (12 pts)   │
│                      │
│  [■]  [6]  [+]      │  ← Button darkens + glows
└──────────────────────┘
     ↑ Icon scales 110%
```

### Disabled State (Remove Button at 0)
```
┌──────────────────────┐
│   📖                 │
│                      │
│ Traer la Biblia      │
│                      │
│ +2 pts    (0 pts)    │  ← Total shows 0
│                      │
│  [▓]  [0]  [+]      │  ← Remove grayed out
└──────────────────────┘
     ↑ No-drop cursor
```

---

## Color-Coded Activity Icons

```
Activity Breakdown with Colors:

📖  Blue Gradient       Traer la Biblia         (600-700 shade)
📜  Purple Gradient     Versículo Memorizado    (600-700 shade)
💬  Green Gradient      Participación           (600-700 shade)
🔍  Yellow Gradient     Búsqueda Rápida         (600-700 shade)
👥  Pink Gradient       Traer un Amigo          (600-700 shade)
❓  Indigo Gradient     Responder Preguntas     (600-700 shade)
🕐  Teal Gradient       Asistencia Puntual      (600-700 shade)
❤️  Red Gradient        Realizar una Oración    (600-700 shade)
```

---

## Navigation Flow Diagram

```
                     ┌─────────────┐
                     │   App.jsx   │
                     │   (Router)  │
                     └──────┬──────┘
                            │
                ┌───────────┴───────────┐
                │                       │
         ┌──────▼─────┐         ┌──────▼─────┐
         │  HomePage  │         │ EditPage   │
         │    (/)     │         │ (/edit/:id)│
         └──────┬─────┘         └──────┬─────┘
                │                      │
    ┌───────────┼──────────┐          │
    │           │          │          │
┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐
│ Nino   │ │ Ninos  │ │  Main  │ │  Main  │
│ Form   │ │ Table  │ │ Layout │ │ Layout │
└────────┘ └────┬───┘ └────────┘ └────────┘
                │                     │
                │ Click Edit          │
                └─────────────────────┘
                      Navigate

User Actions:

HomePage:
  → Add New Kid (Form)
  → View Kids List (Table)
  → Click Edit Icon → Navigate to EditPage
  → Click Delete Icon → Confirm & Delete

EditPage:
  → Click Back Arrow → Navigate to HomePage
  → Click Edit Info → Show Edit Form
  → Click Activity [+] → Add Point
  → Click Activity [-] → Remove Point
  → Update Form → Save Changes
```

---

## Responsive Grid Breakpoints Visual

```
Mobile (< 768px):
┌────┐
│ 📖 │  ← 1 column
├────┤
│ 📜 │
├────┤
│ 💬 │
└────┘

Tablet (768px - 1024px):
┌────┬────┐
│ 📖 │ 📜 │  ← 2 columns
├────┼────┤
│ 💬 │ 🔍 │
└────┴────┘

Desktop (1024px - 1280px):
┌────┬────┬────┐
│ 📖 │ 📜 │ 💬 │  ← 3 columns
├────┼────┼────┤
│ 🔍 │ 👥 │ ❓ │
└────┴────┴────┘

Large Desktop (≥ 1280px):
┌────┬────┬────┬────┐
│ 📖 │ 📜 │ 💬 │ 🔍 │  ← 4 columns
├────┼────┼────┼────┤
│ 👥 │ ❓ │ 🕐 │ ❤️ │
└────┴────┴────┴────┘
```

---

## Interactive Element States

### Button State Progression

```
Primary Action Button (Add Points):

[Normal]           [Hover]            [Active]           [Focus]
┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐
│    +    │  →    │    +    │  →    │    +    │       │    +    │
│         │       │ ↗scale↗ │       │ pressed │       │ ⚪ring⚪ │
└─────────┘       └─────────┘       └─────────┘       └─────────┘
  Blue-600         Blue-700         Blue-800          + Ring
  shadow-lg      shadow-xl        shadow-md          Indicator


Danger Button (Delete/Remove):

[Normal]           [Hover]            [Disabled]
┌─────────┐       ┌─────────┐       ┌─────────┐
│    -    │  →    │    -    │       │    -    │
│         │       │ ↗scale↗ │       │ grayed  │
└─────────┘       └─────────┘       └─────────┘
  Red-600          Red-700          Slate-700
  shadow-lg      shadow-xl        no-drop
                  glow                cursor
```

### Input Field States

```
[Normal]                 [Focus]                 [Error]
┌──────────────┐        ┌──────────────┐       ┌──────────────┐
│ Placeholder  │   →    │ User Input|  │       │ Invalid!     │
│              │        │ ⚪ring⚪      │       │ 🔴 border    │
└──────────────┘        └──────────────┘       └──────────────┘
 Slate-600              Purple-500             Red-500
 border                 ring-2                 border-2
```

---

## Loading & Empty States

### Loading State (HomePage)
```
┌─────────────────────────────┐
│                             │
│         ⟳ (spinning)       │
│                             │
│    Cargando datos...        │
│                             │
└─────────────────────────────┘
```

### Empty State (No Kids)
```
┌─────────────────────────────┐
│                             │
│           👥               │
│      (large icon)           │
│                             │
│  No hay niños registrados.  │
│    Agrega el primero.       │
│                             │
└─────────────────────────────┘
```

### Loading State (EditPage)
```
┌─────────────────────────────┐
│                             │
│         ⟳ (spinning)       │
│                             │
│  Cargando información...    │
│                             │
└─────────────────────────────┘
```

---

## Error State Display

```
┌────────────────────────────────────┐
│ ⚠️ Error: Unable to load data      │
│                                    │
│ Error message details here...      │
└────────────────────────────────────┘
    Red-900 background
    Red-200 text
    Red-700 border
    Backdrop blur effect
```

---

## Confirmation Dialog (Delete)

```
┌────────────────────────────────────┐
│                                    │
│  ¿Estás seguro de eliminar         │
│  este niño?                        │
│                                    │
│  [  Cancelar  ]  [  Eliminar  ]   │
│                                    │
└────────────────────────────────────┘
    Browser native confirm()
    Future: Custom modal component
```

---

## Component Hierarchy

```
App
 │
 ├─ BrowserRouter
 │   │
 │   ├─ Route: / (HomePage)
 │   │   │
 │   │   └─ MainLayout
 │   │       │
 │   │       ├─ Header (Church Icon + Title)
 │   │       │
 │   │       ├─ Main Content
 │   │       │   │
 │   │       │   ├─ Error Display (conditional)
 │   │       │   │
 │   │       │   ├─ Section: Add New Kid
 │   │       │   │   └─ NinoForm
 │   │       │   │       ├─ Input: Nombre
 │   │       │   │       ├─ Input: Apellido
 │   │       │   │       ├─ Input: Edad
 │   │       │   │       └─ Button: Submit (UserPlus icon)
 │   │       │   │
 │   │       │   └─ Section: Kids List
 │   │       │       ├─ Empty State (conditional)
 │   │       │       └─ NinosTable
 │   │       │           ├─ Table Header (User, Trophy icons)
 │   │       │           └─ Table Rows
 │   │       │               ├─ Name
 │   │       │               ├─ Surname
 │   │       │               ├─ Age Badge
 │   │       │               ├─ Total Points Badge
 │   │       │               └─ Actions
 │   │       │                   ├─ Edit Button (Pencil icon)
 │   │       │                   └─ Delete Button (Trash2 icon)
 │   │       │
 │   │       └─ Footer (Church Icon + Text)
 │   │
 │   └─ Route: /edit/:id (EditPage)
 │       │
 │       └─ MainLayout
 │           │
 │           ├─ Header (Same as HomePage)
 │           │
 │           ├─ Main Content
 │           │   │
 │           │   ├─ Back Button (ArrowLeft icon)
 │           │   │
 │           │   ├─ Error Display (conditional)
 │           │   │
 │           │   ├─ Section: Kid Info
 │           │   │   ├─ Name & Age Display
 │           │   │   ├─ Total Points Badge (Trophy icon)
 │           │   │   ├─ Edit Info Button (Save icon)
 │           │   │   └─ NinoForm (conditional when editing)
 │           │   │
 │           │   └─ Section: Points System
 │           │       └─ Activity Grid (responsive)
 │           │           ├─ Activity Card × 8
 │           │           │   ├─ Icon (color-coded)
 │           │           │   ├─ Activity Name
 │           │           │   ├─ Points Info
 │           │           │   ├─ Total Badge
 │           │           │   └─ Controls
 │           │           │       ├─ Remove Button (Minus icon)
 │           │           │       ├─ Count Display
 │           │           │       └─ Add Button (Plus icon)
 │           │
 │           └─ Footer (Same as HomePage)
```

---

## Z-Index Layers

```
Layer 0: Background gradients
Layer 1: Card backgrounds
Layer 2: Content (text, inputs)
Layer 3: Buttons
Layer 4: Hover effects (shadows)
Layer 5: Focus rings
Layer 6: Modals (future)
Layer 7: Tooltips (future)
```

---

## Accessibility Annotations

### Keyboard Navigation Order

HomePage:
```
1. Header (Skip link - future)
2. Form: Nombre input
3. Form: Apellido input
4. Form: Edad input
5. Form: Submit button
6. Table: First row Edit button
7. Table: First row Delete button
8. Table: Second row Edit button
9. Table: Second row Delete button
   ... (continues for all rows)
```

EditPage:
```
1. Header (Skip link - future)
2. Back button
3. Edit Info button
4. (If editing) Form inputs
5. Activity 1: Remove button
6. Activity 1: Add button
7. Activity 2: Remove button
8. Activity 2: Add button
   ... (continues for all activities)
```

### ARIA Labels (Future Enhancement)

```jsx
// Button examples
<button aria-label="Editar Juan Pérez">
  <Pencil />
</button>

<button aria-label="Eliminar Juan Pérez">
  <Trash2 />
</button>

<button
  aria-label="Agregar punto a Traer la Biblia"
  aria-describedby="biblia-count"
>
  <Plus />
</button>

// Count display
<div id="biblia-count" aria-live="polite">
  6 veces
</div>
```

---

## Animation Specifications

### Transitions
```css
/* Button hover */
transition: all 200ms ease-in-out;
transform: scale(1.1);

/* Card hover */
transition: all 300ms ease-in-out;
transform: scale(1.05);

/* Icon hover */
transition: transform 200ms ease-in-out;
transform: scale(1.1);

/* Back button arrow */
transition: transform 200ms ease-in-out;
transform: translateX(-4px);

/* Loading spinner */
animation: spin 1s linear infinite;
```

---

## Print Styles (Future Consideration)

```
When printing:
- Hide: Header, Footer, Action buttons, Navigation
- Show: Kid info, Points summary table
- Colors: Simplified for ink saving
- Layout: Single column, page breaks between kids
```

---

This wireframe documentation provides a complete visual reference for the JordanList redesign, showing all responsive states, interactive elements, and user flows.
