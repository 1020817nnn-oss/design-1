const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");

test("replica renders the five Interface Craft opening cards", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  const expectedTitles = [
    "Working Knowledge",
    "Practical Demonstration",
    "Collaborating with AI",
    "Means & Methods",
    "Interface Kit",
  ];

  assert.match(html, /class="[^"]*\bcard-stage\b/);
  assert.equal((html.match(/class="[^"]*\bcraft-card\b/g) || []).length, 5);

  for (const title of expectedTitles) {
    assert.match(html, new RegExp(title.replace(/[&]/g, "&amp;|&"), "i"));
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
