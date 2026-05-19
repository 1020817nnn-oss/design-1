const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");

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

test("cards define original-inspired geometry, layering, and motion hooks", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.match(html, /--angle:\s*-8deg/);
  assert.match(html, /--angle:\s*4deg/);
  assert.match(html, /--angle:\s*-2deg/);
  assert.match(html, /--angle:\s*1deg/);
  assert.match(html, /--angle:\s*5deg/);

  assert.match(html, /@keyframes\s+cardEnter/);
  assert.match(html, /@keyframes\s+cardFloat/);
  assert.match(html, /\.craft-card:hover/);
  assert.match(html, /prefers-reduced-motion/);
});

test("cards include click interaction for selected and minimized states", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.match(html, /class="[^"]*\bcard-description\b/);
  assert.match(html, /classList\.add\("has-active"\)/);
  assert.match(html, /classList\.add\("is-selected"\)/);
  assert.match(html, /classList\.add\("is-minimized"\)/);
  assert.match(html, /data-collapsed-x/);
  assert.match(html, /Escape/);
});

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
