# Homepage and 3D house storyboard

This is the starting creative direction. Refine it in low-detail browser prototypes before producing an expensive final video or 3D model.

## Overall rhythm

```text
Clear choice
    ↓
Local credibility
    ↓
Memorable house-building story
    ↓
Useful Peterborough map/property experience
    ↓
Practical landlord/tenant tools
    ↓
Maintenance proof
    ↓
Helpful insight
    ↓
One clear next action
```

The beginning should feel confident and spacious. The 3D chapter creates the emotional high point. The second half becomes calmer and increasingly practical.

## Hero film

### Composition

- Full-width media with warm cream/dark overlays only where needed for text contrast
- Logo/header remain crisp HTML
- Text block sits within the central safe width, not hard against an edge
- Audience actions appear as two substantial choices, not tiny pills
- Current-tenant repair route is immediately visible but subordinate

### Suggested 12–18 second master film

The film should feel observational, local and lived-in—not luxury stock footage.

Possible shots:

1. Soft morning light across real brick or a Peterborough residential street
2. A clean property exterior with no readable house number or vehicle plate
3. Curtains/window light changing in a cared-for room
4. A maintenance professional completing a non-sensitive repair detail
5. A clear, tidy living space with natural wear rather than staged luxury
6. A final warm exterior/window-light moment

Do not show documents, keys/security information, private possessions, tenants or staff without written permission. The film must work silently.

### Scroll behaviour

- First screen is immediately readable before media loads
- The film advances or transitions gently over roughly 120–180vh
- Do not pin the hero so long that the visitor cannot reach the site
- At the end, the image softens into cream and introduces the trust section
- Reduced motion uses one approved poster
- Mobile uses a separately framed, shorter source

## 3D house art direction

### Look

- Original stylised British residential house, not a mansion
- Three-quarter/isometric camera, warm and architectural
- Brick `#A63D2F`, cream interior planes, ink/dark structural details and sand accents
- Soft daylight, restrained shadows and lightly rounded geometry
- A cutaway/dollhouse logic without toy-like people
- No house number, branded vehicle, keys, documents or security detail
- No glossy photorealism, chrome, neon, purple or gaming effects

### Model layers

Create the model so these groups can animate independently:

- Foundation/base
- Exterior brick walls
- Roof sections
- Front door and windows
- Interior floor/wall planes
- Kitchen/living/bedroom suggestion pieces
- Warm window/interior lights
- Small maintenance/care details
- Map/locality ground plane

Keep the asset modular and low-detail enough for mobile fallback renders.

## Section layout

Desktop:

- Scene occupies roughly 52–58% of the viewport
- Story copy occupies the remaining readable column
- Copy remains ordinary document content; the scene can be sticky for a limited chapter
- A small progress label states the current chapter
- “Skip the story” and “Switch view” remain available

Mobile:

- Static/short-loop house image above each chapter, or a lightweight sticky image taking no more than 40–45% of the viewport
- Ordinary vertical copy and controls
- No long pinning

## Entry state — the moving parts

The house arrives as several calm exploded layers. It should not look broken or distressed. The message is that property management contains many connected responsibilities.

Copy direction:

**A property has a lot of moving parts.**  
We bring the important ones into one clearer journey.

The selected Landlord or Tenant route determines the next four beats.

## Landlord story

### 1. Prepare

Visual:

- Foundation and primary walls align
- Camera settles from a slightly wider view
- A subtle outline travels around the structure to suggest readiness

Copy:

**Start with a clear picture.**  
Understand the property, its condition and the next steps before it reaches the market.

### 2. Let

Visual:

- Door, windows and outer brick finish move into place
- The exterior becomes presentable and warmly lit
- One restrained listing-card shape appears outside the scene, in HTML

Copy:

**Present the home clearly.**  
Give prospective tenants the information they need to make an informed enquiry.

### 3. Manage

Visual:

- Interior planes align in an orderly sequence
- A simple line connects the rooms, representing communication and coordination
- Avoid literal dashboards floating inside the 3D canvas

Copy:

**Keep the tenancy connected.**  
Good management depends on clear administration, communication and follow-through.

### 4. Care

Visual:

- One small component is removed, restored and returned
- Warm light passes through the house as the final structure settles

Copy:

**Look after what happens next.**  
Maintenance coordination and ongoing attention help keep a property working as it should.

### 5. Confidence

Visual:

- Complete house on a warm Peterborough ground plane
- Camera pulls back slightly; movement ends

Copy:

**Your property is in good hands.**

CTA: **Request a rental appraisal**

## Tenant story

### 1. Find

Visual:

- A simple Peterborough ground plane and a few location markers appear
- The house resolves from one of the markers

Copy:

**Find the right next step.**  
Search clearly and understand what is actually available.

### 2. Understand

Visual:

- House opens as a calm cutaway
- Key rooms become visible
- Cost/feature information appears in nearby HTML cards

Copy:

**Know the home before you commit.**  
See the important features, costs and practical information in one place.

### 3. Move

Visual:

- Front door opens and a few simple neutral boxes settle inside
- Avoid literal people or personal details

Copy:

**Make the move clearer.**  
Understand the steps and what will be needed along the way.

### 4. Live

Visual:

- Interior lights turn on room by room
- One simple care/repair pathway animates without signalling an emergency

Copy:

**Know how to reach us.**  
Clear maintenance and communication routes should continue after move-in.

### 5. At ease

Visual:

- Complete warm home; all movement settles

Copy:

**A good property should feel easy to live in.**

CTA: **View available properties**

## Shared/no-selection story

If a visitor has not chosen a route, use four neutral chapters:

1. Property
2. People
3. Communication
4. Care

End with both audience actions. Do not force a choice before content is available.

## Motion parameters

- Four or five meaningful states, not dozens of decorative animations
- Scene progress follows a bounded chapter timeline
- Transitions ease smoothly; no bouncing or elastic movement
- Camera travel stays modest to avoid motion sickness
- Text changes at stable chapter thresholds, not every scroll pixel
- Reduced-motion state displays all chapter copy in a normal vertical sequence with one static house render

## Prototype requirement

Before commissioning/finalising a GLB, create a low-detail browser previs using boxes/planes or a simple placeholder model. Validate chapter pacing, copy length, responsive behaviour, WebGL failure and performance on a mid-range phone.

