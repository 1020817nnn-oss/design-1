# Industrial Design Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current Interface Craft card replica into a static industrial design content library with curated homepage modules, category browsing, and detail templates.

**Architecture:** Keep the project lightweight by extending the current single-file `index.html`. Store sample content in embedded JavaScript, render homepage/category/detail views from that data, and use hash routes such as `#category/works` and `#item/modular-lamp-handle-study` so the page can run directly from the filesystem.

**Tech Stack:** Plain HTML, CSS, vanilla JavaScript, Node.js `node:test`, `node:assert/strict`, filesystem-based static page testing.

---

## File Structure

- Modify: `C:/Users/Administrator/Desktop/ppt/index.html`
  - Keeps the existing first-viewport card animation.
  - Adds static content data.
  - Adds curated homepage modules below the hero.
  - Adds hash-routed category and detail views.
  - Adds the CSS needed for the new content-library sections.
- Modify: `C:/Users/Administrator/Desktop/ppt/tests/card-replica.test.js`
  - Updates the old replica assertions to the new industrial design content-library requirements.
  - Adds tests for card taxonomy, static data, curated modules, routing hooks, and detail templates.

Do not delete or bulk-remove files. Keep the existing screenshots and reference images untouched.

## Implementation Strategy

The current project has one HTML file and one Node test file. Preserve that shape for the first implementation. Each task below starts by adding a failing test, then implements only enough code for that task, runs the test, and commits.

Run all commands from:

```powershell
C:\Users\Administrator\Desktop\ppt
```

Use this test command throughout:

```powershell
node --test tests/card-replica.test.js
```

Expected passing output contains:

```text
# pass
# fail 0
```

### Task 1: Replace Replica Card Copy With Industrial Design Sections

**Files:**
- Modify: `C:/Users/Administrator/Desktop/ppt/tests/card-replica.test.js`
- Modify: `C:/Users/Administrator/Desktop/ppt/index.html`

- [ ] **Step 1: Replace the opening-card test**

In `tests/card-replica.test.js`, replace the first test named `replica renders the five Interface Craft opening cards` with this test:

```javascript
test("homepage renders the five industrial design library cards", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  const expectedTitles = [
    "Works",
    "Process",
    "Inspiration",
    "Experiments",
    "Methods",
  ];

  assert.match(html, /<title>Industrial Design Library<\/title>/);
  assert.match(html, /<h1 id="page-title">Industrial Design Library<\/h1>/);
  assert.match(html, /A curated working library for industrial design studies, references, experiments, and finished work\./);
  assert.match(html, /class="[^"]*\bcard-stage\b/);
  assert.match(html, /aria-label="Industrial design library sections"/);
  assert.equal((html.match(/class="[^"]*\bcraft-card\b/g) || []).length, 5);

  for (const title of expectedTitles) {
    assert.match(html, new RegExp(`aria-label="${title}"`, "i"));
    assert.match(html, new RegExp(`>${title}<`, "i"));
  }

  for (const category of ["works", "process", "inspiration", "experiments", "methods"]) {
    assert.match(html, new RegExp(`data-category="${category}"`, "i"));
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: FAIL because `index.html` still contains `Interface Craft`, the old card titles, the old stage label, and no `data-category` attributes.

- [ ] **Step 3: Update the document title and hero copy**

In `index.html`, replace:

```html
<title>Interface Craft Cards Replica</title>
```

with:

```html
<title>Industrial Design Library</title>
```

Replace:

```html
<h1 id="page-title">Interface Craft</h1>
<p class="dek">
  A working library for those committed to designing with uncommon care.
</p>
```

with:

```html
<h1 id="page-title">Industrial Design Library</h1>
<p class="dek">
  A curated working library for industrial design studies, references, experiments, and finished work.
</p>
```

- [ ] **Step 4: Update the card stage label**

Replace:

```html
<div class="card-stage" aria-label="Opening course cards">
```

with:

```html
<div class="card-stage" aria-label="Industrial design library sections">
```

- [ ] **Step 5: Replace the five card button opening tags**

Replace the five button opening tags with these exact lines. Keep the existing geometry classes because the CSS depends on them:

```html
<button class="craft-card working" type="button" aria-label="Works" data-category="works">
<button class="craft-card demo" type="button" aria-label="Process" data-category="process">
<button class="craft-card ai" type="button" aria-label="Inspiration" data-category="inspiration">
<button class="craft-card methods" type="button" aria-label="Experiments" data-category="experiments">
<button class="craft-card kit" type="button" aria-label="Methods" data-category="methods">
```

- [ ] **Step 6: Replace the card titles and descriptions**

Use these exact card title and description pairs:

```html
<span class="card-title">Works</span>
<span class="card-description">
  Finished projects, formal case studies, and portfolio-ready industrial design work.
</span>
```

```html
<span class="card-title">Process</span>
<span class="card-description">
  Research, sketches, CAD decisions, prototypes, tests, and iteration records from the studio bench.
</span>
```

```html
<span class="card-title">Inspiration</span>
<span class="card-description">
  Product observations, material references, structures, exhibitions, brands, and trend notes worth keeping.
</span>
```

```html
<span class="card-title">Experiments</span>
<span class="card-description">
  Concepts, AI-assisted studies, parametric trials, CMF tests, and unfinished ideas with useful signals.
</span>
```

```html
<span class="card-title">Methods</span>
<span class="card-description">
  Reusable design methods, toolchain notes, manufacturing lessons, and judgment frameworks.
</span>
```

- [ ] **Step 7: Run the test and verify it passes**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: PASS for all current tests.

- [ ] **Step 8: Commit Task 1**

Run:

```powershell
git add index.html tests/card-replica.test.js
git commit -m "feat: retitle cards for industrial design library"
```

### Task 2: Add Static Content Data

**Files:**
- Modify: `C:/Users/Administrator/Desktop/ppt/tests/card-replica.test.js`
- Modify: `C:/Users/Administrator/Desktop/ppt/index.html`

- [ ] **Step 1: Add a failing test for the content model**

Append this test to `tests/card-replica.test.js`:

```javascript
test("page defines the industrial design content model and sample items", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.match(html, /const\s+sectionMeta\s*=\s*\[/);
  assert.match(html, /const\s+contentItems\s*=\s*\[/);

  for (const field of [
    "title",
    "slug",
    "category",
    "summary",
    "cover",
    "date",
    "status",
    "tags",
    "materials",
    "tools",
    "related",
    "body",
  ]) {
    assert.match(html, new RegExp(`${field}:`, "i"));
  }

  for (const category of ["works", "process", "inspiration", "experiments", "methods"]) {
    assert.match(html, new RegExp(`category:\\s*"${category}"`, "i"));
  }

  assert.match(html, /status:\s*"featured"/);
  assert.match(html, /template:\s*"case-study"/);
  assert.match(html, /template:\s*"research-note"/);
  assert.match(html, /template:\s*"experiment-log"/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: FAIL because `sectionMeta` and `contentItems` do not exist.

- [ ] **Step 3: Add section metadata**

Inside the existing `<script>` tag in `index.html`, immediately after:

```javascript
const cards = [...document.querySelectorAll(".craft-card")];
```

add:

```javascript
const sectionMeta = [
  {
    category: "works",
    title: "Works",
    eyebrow: "Portfolio studies",
    summary: "Finished projects, formal case studies, and portfolio-ready industrial design work.",
  },
  {
    category: "process",
    title: "Process",
    eyebrow: "Studio records",
    summary: "Research, sketches, CAD decisions, prototypes, tests, and iteration records from the studio bench.",
  },
  {
    category: "inspiration",
    title: "Inspiration",
    eyebrow: "Reference library",
    summary: "Product observations, material references, structures, exhibitions, brands, and trend notes worth keeping.",
  },
  {
    category: "experiments",
    title: "Experiments",
    eyebrow: "Exploration log",
    summary: "Concepts, AI-assisted studies, parametric trials, CMF tests, and unfinished ideas with useful signals.",
  },
  {
    category: "methods",
    title: "Methods",
    eyebrow: "Reusable judgment",
    summary: "Design methods, toolchain notes, manufacturing lessons, and judgment frameworks.",
  },
];
```

- [ ] **Step 4: Add sample content items**

Immediately after `sectionMeta`, add:

```javascript
const contentItems = [
  {
    title: "Modular Lamp Handle Study",
    slug: "modular-lamp-handle-study",
    category: "works",
    template: "case-study",
    summary: "A compact lighting object study focused on grip, rotation, repairable parts, and warm desk-side presence.",
    cover: "amber-aluminum",
    date: "2026-05-10",
    status: "featured",
    tags: ["lighting", "ergonomics", "repairable", "desktop"],
    materials: ["brushed aluminum", "warm polycarbonate"],
    tools: ["Rhino", "KeyShot", "foam model"],
    related: ["foam-model-balance-notes", "three-pass-object-critique"],
    body: "The project frames a small lamp as a handled object rather than a static fixture, using a replaceable grip band and visible fasteners to make maintenance legible.",
    projectType: "desktop lighting",
    role: "industrial design, form development, CMF direction",
    year: "2026",
    duration: "3 weeks",
    brief: "Design a small lamp that can move between desk, shelf, and bedside contexts without feeling like portable camping equipment.",
    problem: "Most compact lamps either hide their hardware or overstate portability; this study searches for a calmer middle ground.",
    outcome: "A modular body with a soft handle radius, exposed service points, and a warm translucent diffuser.",
    processHighlights: ["handle section studies", "diffuser proportion tests", "fastener visibility decisions"],
    gallery: ["handle radius model", "diffuser stack render", "exploded service sketch"],
    reflection: "The handle language worked best when the fasteners were treated as honest details rather than hidden compromises.",
  },
  {
    title: "Foam Model Balance Notes",
    slug: "foam-model-balance-notes",
    category: "process",
    template: "research-note",
    summary: "A process note on checking visual weight, hand clearance, and tilt behavior before CAD details become too expensive.",
    cover: "foam-graphite",
    date: "2026-05-08",
    status: "published",
    tags: ["prototype", "ergonomics", "foam", "iteration"],
    materials: ["blue foam", "masking tape"],
    tools: ["utility knife", "calipers", "phone camera"],
    related: ["modular-lamp-handle-study"],
    body: "Fast foam checks made the lamp feel less precious and revealed that the first handle radius looked balanced in render but awkward in hand.",
    linkedWork: "modular-lamp-handle-study",
    stage: "prototype",
    question: "Does the handle invite pickup without making the lamp read as a lantern?",
    inputs: ["1:1 foam body", "three handle radii", "desk height photo pass"],
    iterations: ["narrow upright loop", "low soft bridge", "offset rear grip"],
    decision: "The low soft bridge kept the object domestic while still giving fingers enough clearance.",
    nextStep: "Check the selected bridge radius against diffuser heat and service access.",
  },
  {
    title: "Soft Edge Appliance References",
    slug: "soft-edge-appliance-references",
    category: "inspiration",
    template: "research-note",
    summary: "A small reference set on how softened edges can make technical household objects feel precise without feeling clinical.",
    cover: "soft-cream",
    date: "2026-05-06",
    status: "featured",
    tags: ["appliance", "edge-radius", "domestic", "cmf"],
    materials: ["painted metal", "matte polymer"],
    tools: ["reference board"],
    related: ["three-pass-object-critique"],
    body: "The strongest references use softness as a controlled transition, not as decoration. The edge carries approachability while planes keep the product disciplined.",
    source: "Personal appliance reference board",
    sourceType: "product",
    whyItMatters: "Industrial products often need to look approachable without losing assembly clarity.",
    designObservation: "Large radii work best when paired with crisp part breaks and restrained surface texture.",
    applicableTo: ["home electronics", "lighting", "small tools"],
    imageCredits: "Use original photography or credited references before publishing.",
  },
  {
    title: "Parametric Vent Pattern Tests",
    slug: "parametric-vent-pattern-tests",
    category: "experiments",
    template: "experiment-log",
    summary: "A matrix of vent rhythms testing airflow cues, manufacturability, and visual quietness on small product housings.",
    cover: "blue-grid",
    date: "2026-05-04",
    status: "published",
    tags: ["parametric", "vent", "pattern", "manufacturing"],
    materials: ["anodized aluminum", "molded polymer"],
    tools: ["Grasshopper", "Rhino"],
    related: ["modular-lamp-handle-study"],
    body: "The most successful patterns reduced visual noise by grouping slots into bands rather than distributing them evenly across the full surface.",
    hypothesis: "Grouped vent rhythms can communicate performance while keeping small housings visually calm.",
    method: "Generate slot arrays with controlled spacing, radius, and density, then compare them at product scale.",
    variables: ["slot radius", "row spacing", "band density", "edge setback"],
    outputs: ["six pattern matrix", "two housing mockups", "manufacturing note"],
    evaluation: "Dense center bands looked intentional; evenly spaced grids looked generic and harder to align with part breaks.",
    reusableLearning: "Vent patterns should answer part geometry first and decoration second.",
  },
  {
    title: "Three-Pass Object Critique",
    slug: "three-pass-object-critique",
    category: "methods",
    template: "research-note",
    summary: "A reusable critique method for reading an object through silhouette, interaction, and manufacturing evidence.",
    cover: "ink-paper",
    date: "2026-05-01",
    status: "featured",
    tags: ["critique", "method", "design judgment", "research"],
    materials: [],
    tools: ["notebook", "camera"],
    related: ["soft-edge-appliance-references", "foam-model-balance-notes"],
    body: "The method separates first impression from use behavior and production evidence so critique does not collapse into taste too quickly.",
    topic: "Object critique",
    context: "Use this when reviewing references, competitors, prototypes, or finished products.",
    principle: "Read the object three times before deciding whether it works.",
    steps: ["Trace the silhouette", "Act out the interaction", "Find the manufacturing evidence"],
    example: "A desk lamp can look balanced in silhouette but fail the interaction pass if the adjustment point is visually hidden.",
    pitfalls: ["Judging only from render angles", "Treating CMF as separate from structure", "Skipping hand-scale checks"],
    templates: ["silhouette / interaction / evidence note grid"],
  },
];
```

- [ ] **Step 5: Run the test and verify it passes**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: PASS for all tests.

- [ ] **Step 6: Commit Task 2**

Run:

```powershell
git add index.html tests/card-replica.test.js
git commit -m "feat: add industrial design content data"
```

### Task 3: Render Curated Homepage Modules

**Files:**
- Modify: `C:/Users/Administrator/Desktop/ppt/tests/card-replica.test.js`
- Modify: `C:/Users/Administrator/Desktop/ppt/index.html`

- [ ] **Step 1: Add a failing test for curated homepage sections**

Append this test to `tests/card-replica.test.js`:

```javascript
test("homepage includes curated content library modules", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.match(html, /id="home-view"/);
  assert.match(html, /class="[^"]*\blibrary-feed\b/);
  assert.match(html, /function\s+renderHome/);
  assert.match(html, /function\s+renderContentModule/);

  for (const label of [
    "Featured Works",
    "Recent Notes",
    "Material / CMF Watch",
    "Studio Experiments",
    "Reading the Index",
  ]) {
    assert.match(html, new RegExp(label.replace("/", "\\/")));
  }

  assert.match(html, /class="[^"]*\bcontent-card\b/);
  assert.match(html, /class="[^"]*\btag-index\b/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: FAIL because the homepage content-library sections and render functions do not exist.

- [ ] **Step 3: Add homepage containers below the hero**

In `index.html`, immediately after the closing `</section>` for the hero and before `</main>`, add:

```html
<section class="library-feed" id="library-feed" aria-label="Curated industrial design content">
  <div id="home-view"></div>
</section>
```

- [ ] **Step 4: Add CSS for curated modules**

In the `<style>` block, immediately before `@keyframes cardEnter`, add:

```css
.library-feed {
  width: min(1120px, 100% - 32px);
  margin: -44px auto 0;
  padding: 0 0 96px;
}

.feed-section {
  padding: 52px 0;
  border-top: 1px solid rgba(32, 31, 30, 0.12);
}

.feed-header {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(220px, 0.42fr);
  gap: 32px;
  align-items: end;
  margin-bottom: 22px;
}

.feed-eyebrow,
.card-meta,
.detail-kicker {
  margin: 0 0 10px;
  color: #8a8176;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.feed-title {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(30px, 3vw, 44px);
  font-weight: 500;
  line-height: 1;
}

.feed-summary {
  margin: 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.5;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.content-card {
  display: grid;
  min-height: 322px;
  overflow: hidden;
  border: 1px solid rgba(32, 31, 30, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.48);
  color: inherit;
  text-decoration: none;
}

.content-card:focus-visible {
  outline: 3px solid rgba(19, 107, 255, 0.42);
  outline-offset: 4px;
}

.cover-swatch {
  min-height: 154px;
  border-bottom: 1px solid rgba(32, 31, 30, 0.1);
}

.cover-swatch[data-cover="amber-aluminum"] {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.34), transparent 42%),
    linear-gradient(120deg, #c86d2f 0 38%, #f5c474 38% 58%, #9aa0a3 58% 100%);
}

.cover-swatch[data-cover="foam-graphite"] {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.38), transparent),
    repeating-linear-gradient(135deg, #b7c3d0 0 18px, #36404a 18px 22px, #d9dde0 22px 36px);
}

.cover-swatch[data-cover="soft-cream"] {
  background:
    radial-gradient(circle at 28% 30%, #fff5dc 0 18%, transparent 19%),
    linear-gradient(135deg, #f4e7cc, #b7ada1 48%, #f8f4ea);
}

.cover-swatch[data-cover="blue-grid"] {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent),
    repeating-linear-gradient(90deg, #0d6593 0 4px, #9ed7ef 4px 7px, #0d6593 7px 22px);
}

.cover-swatch[data-cover="ink-paper"] {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.52), transparent),
    repeating-linear-gradient(0deg, #27221d 0 2px, #f2e7d2 2px 14px);
}

.content-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
}

.content-card h3 {
  margin: 0;
  font-family: var(--serif);
  font-size: 25px;
  font-weight: 500;
  line-height: 1.05;
}

.content-card p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.42;
}

.tag-row,
.tag-index {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  border: 1px solid rgba(32, 31, 30, 0.14);
  border-radius: 999px;
  padding: 3px 9px;
  color: #4f4942;
  font-size: 12px;
  line-height: 1;
}

.tag-index {
  padding: 18px;
  border: 1px solid rgba(32, 31, 30, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.48);
}
```

- [ ] **Step 5: Add homepage render helpers**

Inside the `<script>` tag, after `contentItems`, add:

```javascript
const homeView = document.querySelector("#home-view");

function byDateDesc(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

function getItemsForModule(moduleName) {
  if (moduleName === "featuredWorks") {
    return contentItems.filter((item) => item.category === "works" && item.status === "featured").slice(0, 3);
  }

  if (moduleName === "recentNotes") {
    return byDateDesc(contentItems.filter((item) => item.category !== "works")).slice(0, 3);
  }

  if (moduleName === "cmfWatch") {
    return contentItems.filter((item) => item.tags.includes("cmf") || item.materials.length > 0).slice(0, 3);
  }

  if (moduleName === "studioExperiments") {
    return contentItems.filter((item) => item.category === "experiments").slice(0, 3);
  }

  return [];
}

function createTagPills(tags) {
  return tags.map((tag) => `<span class="tag-pill">${tag}</span>`).join("");
}

function createContentCard(item) {
  return `
    <a class="content-card" href="#item/${item.slug}" data-route="item" data-category="${item.category}">
      <span class="cover-swatch" data-cover="${item.cover}" aria-hidden="true"></span>
      <span class="content-card-body">
        <span class="card-meta">${item.category} / ${item.date}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <span class="tag-row">${createTagPills(item.tags.slice(0, 3))}</span>
      </span>
    </a>
  `;
}

function renderContentModule({ eyebrow, title, summary, items }) {
  return `
    <section class="feed-section">
      <div class="feed-header">
        <div>
          <p class="feed-eyebrow">${eyebrow}</p>
          <h2 class="feed-title">${title}</h2>
        </div>
        <p class="feed-summary">${summary}</p>
      </div>
      <div class="content-grid">
        ${items.map(createContentCard).join("")}
      </div>
    </section>
  `;
}

function renderTagIndex() {
  const tags = [...new Set(contentItems.flatMap((item) => item.tags))].sort();

  return `
    <section class="feed-section">
      <div class="feed-header">
        <div>
          <p class="feed-eyebrow">Reading the Index</p>
          <h2 class="feed-title">Browse by material, process, and design question.</h2>
        </div>
        <p class="feed-summary">Tags connect finished works to notes, experiments, references, and methods.</p>
      </div>
      <div class="tag-index">
        ${createTagPills(tags)}
      </div>
    </section>
  `;
}

function renderHome() {
  homeView.innerHTML = [
    renderContentModule({
      eyebrow: "Featured Works",
      title: "Portfolio-level studies with the process still visible.",
      summary: "Selected finished work anchors the library and gives visitors a fast read on design range.",
      items: getItemsForModule("featuredWorks"),
    }),
    renderContentModule({
      eyebrow: "Recent Notes",
      title: "Fresh observations from the studio notebook.",
      summary: "Process, inspiration, and methods stay close to the work instead of hiding behind finished images.",
      items: getItemsForModule("recentNotes"),
    }),
    renderContentModule({
      eyebrow: "Material / CMF Watch",
      title: "Surfaces, finishes, and material signals worth revisiting.",
      summary: "A compact lens on industrial design details that often decide whether an object feels resolved.",
      items: getItemsForModule("cmfWatch"),
    }),
    renderContentModule({
      eyebrow: "Studio Experiments",
      title: "Small trials that test form, structure, and interaction.",
      summary: "The experiment log keeps unfinished ideas useful by naming the hypothesis and result.",
      items: getItemsForModule("studioExperiments"),
    }),
    renderTagIndex(),
  ].join("");
}
```

- [ ] **Step 6: Call `renderHome` after event listeners are configured**

At the end of the `<script>` tag, after the existing `document.addEventListener("keydown", ...)` block, add:

```javascript
renderHome();
```

- [ ] **Step 7: Add responsive CSS for homepage modules**

Inside the existing `@media (max-width: 820px)` block, after the `.card-stage` rule, add:

```css
.library-feed {
  width: min(100%, 100vw - 32px);
  margin-top: -24px;
}

.feed-header {
  grid-template-columns: 1fr;
  gap: 12px;
}

.content-grid {
  grid-template-columns: 1fr;
}

.content-card {
  min-height: 0;
}
```

- [ ] **Step 8: Run the test and verify it passes**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: PASS for all tests.

- [ ] **Step 9: Commit Task 3**

Run:

```powershell
git add index.html tests/card-replica.test.js
git commit -m "feat: render curated homepage modules"
```

### Task 4: Add Category Views and Hash Routing

**Files:**
- Modify: `C:/Users/Administrator/Desktop/ppt/tests/card-replica.test.js`
- Modify: `C:/Users/Administrator/Desktop/ppt/index.html`

- [ ] **Step 1: Add a failing test for category routing**

Append this test to `tests/card-replica.test.js`:

```javascript
test("page defines hash-routed category views", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.match(html, /id="category-view"/);
  assert.match(html, /function\s+renderRoute/);
  assert.match(html, /function\s+renderCategory/);
  assert.match(html, /function\s+navigateToCategory/);
  assert.match(html, /hashchange",\s*renderRoute/);
  assert.match(html, /#category\/\$\{category\}/);
  assert.match(html, /data-route="category"/);
  assert.match(html, /Related Sections/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: FAIL because category routing does not exist.

- [ ] **Step 3: Add the category view container**

In `index.html`, immediately after:

```html
<div id="home-view"></div>
```

add:

```html
<div id="category-view" hidden></div>
```

- [ ] **Step 4: Add category view CSS**

In the `<style>` block, immediately after the `.tag-index` rule, add:

```css
.route-panel {
  padding: 52px 0 96px;
  border-top: 1px solid rgba(32, 31, 30, 0.12);
}

.route-topline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 34px;
}

.back-link {
  color: #4f4942;
  font-size: 14px;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.category-hero {
  max-width: 760px;
  margin-bottom: 34px;
}

.category-hero h2 {
  margin: 0 0 16px;
  font-family: var(--serif);
  font-size: clamp(42px, 6vw, 82px);
  font-weight: 500;
  line-height: 0.95;
}

.category-hero p {
  margin: 0;
  color: var(--muted);
  font-size: 19px;
  line-height: 1.45;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 24px;
}
```

- [ ] **Step 5: Add category rendering functions**

Inside the `<script>` tag, after `renderHome`, add:

```javascript
const categoryView = document.querySelector("#category-view");

function getSection(category) {
  return sectionMeta.find((section) => section.category === category);
}

function getRelatedSections(category) {
  return sectionMeta.filter((section) => section.category !== category).slice(0, 3);
}

function renderCategory(category) {
  const section = getSection(category);

  if (!section) {
    window.location.hash = "";
    return;
  }

  const items = byDateDesc(contentItems.filter((item) => item.category === category));
  const tags = [...new Set(items.flatMap((item) => item.tags))].sort();
  const relatedSections = getRelatedSections(category);

  categoryView.innerHTML = `
    <section class="route-panel">
      <div class="route-topline">
        <a class="back-link" href="#">Back to library home</a>
        <span class="detail-kicker">${section.eyebrow}</span>
      </div>
      <div class="category-hero">
        <h2>${section.title}</h2>
        <p>${section.summary}</p>
      </div>
      <div class="filter-row" aria-label="${section.title} filters">
        ${createTagPills(tags)}
      </div>
      <div class="content-grid">
        ${items.map(createContentCard).join("")}
      </div>
      <section class="feed-section">
        <div class="feed-header">
          <div>
            <p class="feed-eyebrow">Related Sections</p>
            <h2 class="feed-title">Move sideways through the library.</h2>
          </div>
          <p class="feed-summary">Industrial design work usually crosses finished projects, process, references, experiments, and methods.</p>
        </div>
        <div class="tag-index">
          ${relatedSections.map((related) => `<a class="tag-pill" data-route="category" href="#category/${related.category}">${related.title}</a>`).join("")}
        </div>
      </section>
    </section>
  `;
}

function showHomeView() {
  homeView.hidden = false;
  categoryView.hidden = true;
}

function showCategoryView(category) {
  renderCategory(category);
  homeView.hidden = true;
  categoryView.hidden = false;
  document.querySelector("#library-feed").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderRoute() {
  const hash = window.location.hash.replace(/^#/, "");

  if (hash.startsWith("category/")) {
    showCategoryView(hash.replace("category/", ""));
    return;
  }

  showHomeView();
}

function navigateToCategory(category) {
  window.location.hash = `category/${category}`;
}
```

- [ ] **Step 6: Change card click behavior to route on second click**

Inside `setActiveCard`, replace:

```javascript
if (currentIndex === String(activeIndex)) {
  clearActiveCard();
  return;
}
```

with:

```javascript
if (currentIndex === String(activeIndex)) {
  navigateToCategory(cards[activeIndex].dataset.category);
  return;
}
```

This preserves the selected/minimized card reveal on first click and routes to the section on the second click. Escape still clears the selected state.

- [ ] **Step 7: Add routing event listeners**

At the end of the `<script>` tag, replace:

```javascript
renderHome();
```

with:

```javascript
renderHome();
window.addEventListener("hashchange", renderRoute);
renderRoute();
```

- [ ] **Step 8: Run the test and verify it passes**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: PASS for all tests.

- [ ] **Step 9: Commit Task 4**

Run:

```powershell
git add index.html tests/card-replica.test.js
git commit -m "feat: add category routing"
```

### Task 5: Add Detail Views and Three Templates

**Files:**
- Modify: `C:/Users/Administrator/Desktop/ppt/tests/card-replica.test.js`
- Modify: `C:/Users/Administrator/Desktop/ppt/index.html`

- [ ] **Step 1: Add a failing test for detail templates**

Append this test to `tests/card-replica.test.js`:

```javascript
test("page defines item detail views for case studies, research notes, and experiment logs", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.match(html, /id="detail-view"/);
  assert.match(html, /function\s+renderDetail/);
  assert.match(html, /function\s+renderCaseStudy/);
  assert.match(html, /function\s+renderResearchNote/);
  assert.match(html, /function\s+renderExperimentLog/);
  assert.match(html, /Case Study/);
  assert.match(html, /Research Note/);
  assert.match(html, /Experiment Log/);
  assert.match(html, /#item\/\$\{item\.slug\}/);
  assert.match(html, /hash\.startsWith\("item\/"\)/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: FAIL because detail views and template renderers do not exist.

- [ ] **Step 3: Add the detail view container**

In `index.html`, immediately after:

```html
<div id="category-view" hidden></div>
```

add:

```html
<div id="detail-view" hidden></div>
```

- [ ] **Step 4: Add detail view CSS**

In the `<style>` block, immediately after the `.filter-row` rule, add:

```css
.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.72fr) minmax(240px, 0.28fr);
  gap: 40px;
  align-items: start;
}

.detail-main h2 {
  margin: 0 0 18px;
  font-family: var(--serif);
  font-size: clamp(44px, 6vw, 86px);
  font-weight: 500;
  line-height: 0.92;
}

.detail-summary {
  margin: 0 0 34px;
  color: var(--muted);
  font-size: 21px;
  line-height: 1.42;
}

.detail-cover {
  min-height: 340px;
  margin-bottom: 34px;
  overflow: hidden;
  border: 1px solid rgba(32, 31, 30, 0.12);
  border-radius: 8px;
}

.detail-section {
  padding: 28px 0;
  border-top: 1px solid rgba(32, 31, 30, 0.1);
}

.detail-section h3 {
  margin: 0 0 12px;
  font-family: var(--serif);
  font-size: 30px;
  font-weight: 500;
}

.detail-section p,
.detail-section li {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.55;
}

.detail-section ul {
  margin: 0;
  padding-left: 20px;
}

.detail-sidebar {
  position: sticky;
  top: 74px;
  border: 1px solid rgba(32, 31, 30, 0.12);
  border-radius: 8px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.58);
}

.detail-meta-list {
  display: grid;
  gap: 14px;
  margin: 0;
}

.detail-meta-list dt {
  color: #8a8176;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.detail-meta-list dd {
  margin: 4px 0 0;
  color: #37322d;
  font-size: 14px;
  line-height: 1.4;
}
```

- [ ] **Step 5: Add detail helper functions**

Inside the `<script>` tag, after `const categoryView = document.querySelector("#category-view");`, add:

```javascript
const detailView = document.querySelector("#detail-view");
```

After `renderCategory`, add:

```javascript
function getItem(slug) {
  return contentItems.find((item) => item.slug === slug);
}

function renderList(values) {
  return `<ul>${values.map((value) => `<li>${value}</li>`).join("")}</ul>`;
}

function renderMetaList(item) {
  const rows = [
    ["Category", item.category],
    ["Date", item.date],
    ["Status", item.status],
    ["Materials", item.materials.length ? item.materials.join(", ") : "Not material-specific"],
    ["Tools", item.tools.length ? item.tools.join(", ") : "Notebook"],
    ["Tags", item.tags.join(", ")],
  ];

  return `
    <dl class="detail-meta-list">
      ${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
    </dl>
  `;
}

function renderDetailShell(item, templateLabel, mainContent) {
  return `
    <section class="route-panel">
      <div class="route-topline">
        <a class="back-link" href="#category/${item.category}">Back to ${getSection(item.category).title}</a>
        <span class="detail-kicker">${templateLabel}</span>
      </div>
      <div class="detail-layout">
        <article class="detail-main">
          <h2>${item.title}</h2>
          <p class="detail-summary">${item.summary}</p>
          <div class="detail-cover cover-swatch" data-cover="${item.cover}" aria-hidden="true"></div>
          ${mainContent}
        </article>
        <aside class="detail-sidebar" aria-label="${item.title} metadata">
          ${renderMetaList(item)}
        </aside>
      </div>
    </section>
  `;
}
```

- [ ] **Step 6: Add the three detail template renderers**

Immediately after `renderDetailShell`, add:

```javascript
function renderCaseStudy(item) {
  return renderDetailShell(item, "Case Study", `
    <section class="detail-section">
      <h3>Brief</h3>
      <p>${item.brief}</p>
    </section>
    <section class="detail-section">
      <h3>Problem</h3>
      <p>${item.problem}</p>
    </section>
    <section class="detail-section">
      <h3>Outcome</h3>
      <p>${item.outcome}</p>
    </section>
    <section class="detail-section">
      <h3>Process Highlights</h3>
      ${renderList(item.processHighlights)}
    </section>
    <section class="detail-section">
      <h3>Gallery Notes</h3>
      ${renderList(item.gallery)}
    </section>
    <section class="detail-section">
      <h3>Reflection</h3>
      <p>${item.reflection}</p>
    </section>
  `);
}

function renderResearchNote(item) {
  const sections = [
    item.question ? ["Question", item.question] : null,
    item.decision ? ["Decision", item.decision] : null,
    item.whyItMatters ? ["Why It Matters", item.whyItMatters] : null,
    item.designObservation ? ["Design Observation", item.designObservation] : null,
    item.principle ? ["Principle", item.principle] : null,
    item.example ? ["Example", item.example] : null,
    item.nextStep ? ["Next Step", item.nextStep] : null,
  ].filter(Boolean);

  return renderDetailShell(item, "Research Note", `
    <section class="detail-section">
      <h3>Note</h3>
      <p>${item.body}</p>
    </section>
    ${sections.map(([title, text]) => `
      <section class="detail-section">
        <h3>${title}</h3>
        <p>${text}</p>
      </section>
    `).join("")}
    ${item.steps ? `
      <section class="detail-section">
        <h3>Steps</h3>
        ${renderList(item.steps)}
      </section>
    ` : ""}
  `);
}

function renderExperimentLog(item) {
  return renderDetailShell(item, "Experiment Log", `
    <section class="detail-section">
      <h3>Hypothesis</h3>
      <p>${item.hypothesis}</p>
    </section>
    <section class="detail-section">
      <h3>Method</h3>
      <p>${item.method}</p>
    </section>
    <section class="detail-section">
      <h3>Variables</h3>
      ${renderList(item.variables)}
    </section>
    <section class="detail-section">
      <h3>Outputs</h3>
      ${renderList(item.outputs)}
    </section>
    <section class="detail-section">
      <h3>Evaluation</h3>
      <p>${item.evaluation}</p>
    </section>
    <section class="detail-section">
      <h3>Reusable Learning</h3>
      <p>${item.reusableLearning}</p>
    </section>
  `);
}

function renderDetail(slug) {
  const item = getItem(slug);

  if (!item) {
    window.location.hash = "";
    return;
  }

  if (item.template === "case-study") {
    detailView.innerHTML = renderCaseStudy(item);
  } else if (item.template === "experiment-log") {
    detailView.innerHTML = renderExperimentLog(item);
  } else {
    detailView.innerHTML = renderResearchNote(item);
  }
}
```

- [ ] **Step 7: Update view visibility functions**

Replace `showHomeView` with:

```javascript
function showHomeView() {
  homeView.hidden = false;
  categoryView.hidden = true;
  detailView.hidden = true;
}
```

Replace `showCategoryView` with:

```javascript
function showCategoryView(category) {
  renderCategory(category);
  homeView.hidden = true;
  categoryView.hidden = false;
  detailView.hidden = true;
  document.querySelector("#library-feed").scrollIntoView({ behavior: "smooth", block: "start" });
}
```

Add this function after `showCategoryView`:

```javascript
function showDetailView(slug) {
  renderDetail(slug);
  homeView.hidden = true;
  categoryView.hidden = true;
  detailView.hidden = false;
  document.querySelector("#library-feed").scrollIntoView({ behavior: "smooth", block: "start" });
}
```

- [ ] **Step 8: Update `renderRoute` for item routes**

Inside `renderRoute`, after the category route branch, add:

```javascript
if (hash.startsWith("item/")) {
  showDetailView(hash.replace("item/", ""));
  return;
}
```

- [ ] **Step 9: Add responsive CSS for detail pages**

Inside the existing `@media (max-width: 820px)` block, after the homepage module responsive CSS, add:

```css
.detail-layout {
  grid-template-columns: 1fr;
}

.detail-sidebar {
  position: static;
}

.detail-cover {
  min-height: 220px;
}
```

- [ ] **Step 10: Run the test and verify it passes**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: PASS for all tests.

- [ ] **Step 11: Commit Task 5**

Run:

```powershell
git add index.html tests/card-replica.test.js
git commit -m "feat: add detail templates"
```

### Task 6: Final Verification and Visual QA

**Files:**
- Modify: `C:/Users/Administrator/Desktop/ppt/tests/card-replica.test.js`
- Modify: `C:/Users/Administrator/Desktop/ppt/index.html`

- [ ] **Step 1: Add a final regression test for preserved card behavior**

Replace the existing test named `cards include click interaction for selected and minimized states` with this version:

```javascript
test("cards preserve selected and minimized states while supporting category routes", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.match(html, /class="[^"]*\bcard-description\b/);
  assert.match(html, /classList\.add\("has-active"\)/);
  assert.match(html, /classList\.add\("is-selected"\)/);
  assert.match(html, /classList\.add\("is-minimized"\)/);
  assert.match(html, /data-collapsed-x/);
  assert.match(html, /Escape/);
  assert.match(html, /navigateToCategory\(cards\[activeIndex\]\.dataset\.category\)/);
  assert.match(html, /aria-pressed/);
});
```

- [ ] **Step 2: Run the full test suite**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: PASS for all tests.

- [ ] **Step 3: Open the page for local visual QA**

Open this file in the browser:

```text
file:///C:/Users/Administrator/Desktop/ppt/index.html
```

Check desktop at roughly 1440 by 900:

- The top-left mark and top-right button remain fixed.
- The hero card stack still renders with five cards.
- First click on a card selects it and minimizes the others.
- Second click on the same selected card routes to the matching category.
- Escape clears a selected card before routing.
- The curated homepage modules appear below the hero.
- Category pages show the category title, filters, cards, and related section links.
- Item links open the correct detail template.

- [ ] **Step 4: Check mobile visual behavior**

Resize the browser to roughly 390 by 844:

- The hero title and deck text fit without horizontal scrolling.
- The card stage stays centered.
- Homepage content cards become a single column.
- Detail views become a single column.
- Tag pills wrap cleanly.
- No content overlaps the fixed mark or button.

- [ ] **Step 5: Fix any visual defects found in Step 3 or Step 4**

Use these targeted CSS changes if the listed defect appears:

If homepage content starts too close to the card stage, change:

```css
.library-feed {
  margin: -44px auto 0;
}
```

to:

```css
.library-feed {
  margin: 0 auto;
}
```

If card titles are too long in selected state, change:

```css
.card-stage.has-active .craft-card.is-selected .card-title {
  font-size: 36px;
}
```

to:

```css
.card-stage.has-active .craft-card.is-selected .card-title {
  font-size: 34px;
}
```

If mobile content is too tight under the hero, change the mobile `.library-feed` rule to:

```css
.library-feed {
  width: min(100%, 100vw - 32px);
  margin-top: 12px;
}
```

- [ ] **Step 6: Re-run the full test suite after visual fixes**

Run:

```powershell
node --test tests/card-replica.test.js
```

Expected: PASS for all tests.

- [ ] **Step 7: Commit Task 6**

Run:

```powershell
git add index.html tests/card-replica.test.js
git commit -m "test: verify industrial design library behavior"
```

## Completion Criteria

Implementation is complete when:

- `node --test tests/card-replica.test.js` passes.
- `index.html` still opens directly from the filesystem.
- The five-card hero now represents Works, Process, Inspiration, Experiments, and Methods.
- The homepage includes Featured Works, Recent Notes, Material / CMF Watch, Studio Experiments, and Reading the Index.
- Category routes work with `#category/works`, `#category/process`, `#category/inspiration`, `#category/experiments`, and `#category/methods`.
- Item detail routes work with `#item/modular-lamp-handle-study`, `#item/foam-model-balance-notes`, `#item/soft-edge-appliance-references`, `#item/parametric-vent-pattern-tests`, and `#item/three-pass-object-critique`.
- The page has no horizontal overflow on desktop or mobile.
- Existing screenshot/reference files remain untouched.

## Self-Review

Spec coverage:

- Product positioning is covered by Task 1 hero copy and Task 3 homepage modules.
- Five-section information architecture is covered by Task 1 card labels and Task 2 `sectionMeta`.
- Shared content model is covered by Task 2 `contentItems`.
- Works, Process, Inspiration, Experiments, and Methods extensions are represented in Task 2 sample items.
- Homepage curated modules are covered by Task 3.
- Category pages are covered by Task 4.
- Three detail templates are covered by Task 5.
- Existing card motion and selected/minimized behavior are protected by Task 6.
- First-version scope avoids CMS, authentication, newsletter, full-text search, and heavy new animation.

Type consistency:

- Categories use `works`, `process`, `inspiration`, `experiments`, and `methods`.
- Detail templates use `case-study`, `research-note`, and `experiment-log`.
- Routes use `#category/<category>` and `#item/<slug>`.
- The sample item slugs referenced in `related` fields are defined in `contentItems`.
