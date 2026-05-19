const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");

function extractArrayLiteral(source, constName) {
  const declaration = new RegExp(`const\\s+${constName}\\s*=\\s*\\[`);
  const match = declaration.exec(source);

  assert.ok(match, `expected ${constName} declaration`);

  const start = source.indexOf("[", match.index);
  let depth = 0;
  let quote = "";
  let isEscaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === quote) {
        quote = "";
      }

      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  assert.fail(`could not extract ${constName} array literal`);
}

function readArrayFromHtml(html, constName) {
  const literal = extractArrayLiteral(html, constName);
  const value = vm.runInNewContext(`(${literal})`, Object.create(null), {
    timeout: 1000,
  });

  return JSON.parse(JSON.stringify(value));
}

function extractInlineScript(html) {
  const match = html.match(/<script>([\s\S]*?)<\/script>/);

  assert.ok(match, "expected inline script");

  return match[1];
}

function createClassList() {
  const classes = new Set();

  return {
    add: (...tokens) => tokens.forEach((token) => classes.add(token)),
    remove: (...tokens) => tokens.forEach((token) => classes.delete(token)),
    contains: (token) => classes.has(token),
  };
}

function createCardStub() {
  return {
    dataset: {},
    classList: createClassList(),
    style: {
      setProperty() {},
    },
    addEventListener() {},
    removeAttribute() {},
    setAttribute() {},
  };
}

function runInlineScript(html, beforeRender = "") {
  const homeView = { innerHTML: "" };
  const stage = {
    dataset: {},
    classList: createClassList(),
  };
  const cards = Array.from({ length: 5 }, createCardStub);
  const script = extractInlineScript(html).replace(/\n\s*renderHome\(\);/, `\n${beforeRender}\n      renderHome();`);
  const context = {
    document: {
      querySelector(selector) {
        if (selector === "#home-view") {
          return homeView;
        }

        if (selector === ".card-stage") {
          return stage;
        }

        return null;
      },
      querySelectorAll(selector) {
        if (selector === ".craft-card") {
          return cards;
        }

        return [];
      },
      addEventListener() {},
    },
  };

  vm.runInNewContext(script, context, { timeout: 1000 });

  return { homeView, stage, cards };
}

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
  const sectionMeta = readArrayFromHtml(html, "sectionMeta");
  const contentItems = readArrayFromHtml(html, "contentItems");
  const expectedCategories = ["works", "process", "inspiration", "experiments", "methods"];
  const requiredFields = [
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
  ];
  const expectedTitles = [
    "Modular Lamp Handle Study",
    "Foam Model Balance Notes",
    "Soft Edge Appliance References",
    "Parametric Vent Pattern Tests",
    "Three-Pass Object Critique",
  ];
  const expectedItemMetaByTitle = new Map([
    ["Modular Lamp Handle Study", { category: "works", template: "case-study" }],
    ["Foam Model Balance Notes", { category: "process", template: "research-note" }],
    ["Soft Edge Appliance References", { category: "inspiration", template: "research-note" }],
    ["Parametric Vent Pattern Tests", { category: "experiments", template: "experiment-log" }],
    ["Three-Pass Object Critique", { category: "methods", template: "research-note" }],
  ]);

  assert.equal(sectionMeta.length, 5);
  assert.equal(contentItems.length, 5);
  assert.deepEqual(sectionMeta.map((section) => section.category), expectedCategories);

  const categorySet = new Set(expectedCategories);
  const slugs = contentItems.map((item) => item.slug);
  const slugSet = new Set(slugs);

  assert.equal(slugSet.size, contentItems.length);
  assert.deepEqual([...new Set(contentItems.map((item) => item.category))].sort(), expectedCategories.toSorted());

  for (const item of contentItems) {
    for (const field of requiredFields) {
      assert.ok(Object.hasOwn(item, field), `expected ${item.slug} to define ${field}`);
    }

    assert.ok(categorySet.has(item.category), `expected ${item.slug} category to match a section`);
    assert.deepEqual(
      { category: item.category, template: item.template },
      expectedItemMetaByTitle.get(item.title),
      `expected ${item.title} to use its intended category and template`,
    );
    assert.ok(Array.isArray(item.tags), `expected ${item.slug} tags to be an array`);
    assert.ok(Array.isArray(item.materials), `expected ${item.slug} materials to be an array`);
    assert.ok(Array.isArray(item.tools), `expected ${item.slug} tools to be an array`);
    assert.ok(Array.isArray(item.related), `expected ${item.slug} related to be an array`);

    for (const relatedSlug of item.related) {
      assert.ok(slugSet.has(relatedSlug), `expected ${item.slug} related slug ${relatedSlug} to resolve`);
    }
  }

  assert.deepEqual([...new Set(contentItems.map((item) => item.template))].sort(), [
    "case-study",
    "experiment-log",
    "research-note",
  ]);
  assert.ok(contentItems.some((item) => item.status === "featured"));
  assert.deepEqual(contentItems.map((item) => item.title).sort(), expectedTitles.sort());
});

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

test("homepage render creates modules and content cards from data", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const { homeView } = runInlineScript(html);

  assert.ok(homeView);

  for (const label of [
    "Featured Works",
    "Recent Notes",
    "Material / CMF Watch",
    "Studio Experiments",
    "Reading the Index",
  ]) {
    assert.match(homeView.innerHTML, new RegExp(label.replace("/", "\\/")));
  }

  assert.match(homeView.innerHTML, /href="#item\/modular-lamp-handle-study"/);
  assert.match(homeView.innerHTML, /data-category="works"/);
  assert.match(homeView.innerHTML, /class="content-card"/);
  assert.match(homeView.innerHTML, /class="tag-index"/);
});

test("homepage render tolerates optional materials and escapes content data", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const unsafeTitle = `Unsafe <Title> & "Quote" 'Apostrophe'`;
  const unsafeSummary = `Summary with <script>alert("x")</script> & "quotes"`;
  const unsafeTag = `cmf"><script>alert('tag')</script>`;
  const beforeRender = `
      contentItems.push({
        title: ${JSON.stringify(unsafeTitle)},
        slug: "unsafe-item",
        category: "inspiration",
        template: "research-note",
        summary: ${JSON.stringify(unsafeSummary)},
        cover: "soft-cream",
        date: "2026-05-12",
        status: "published",
        tags: [${JSON.stringify(unsafeTag)}],
        tools: [],
        related: [],
        body: "Unsafe fixture item."
      });
  `;

  const { homeView } = runInlineScript(html, beforeRender);

  assert.match(homeView.innerHTML, /Unsafe &lt;Title&gt; &amp; &quot;Quote&quot; &#39;Apostrophe&#39;/);
  assert.match(homeView.innerHTML, /Summary with &lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt; &amp; &quot;quotes&quot;/);
  assert.match(homeView.innerHTML, /cmf&quot;&gt;&lt;script&gt;alert\(&#39;tag&#39;\)&lt;\/script&gt;/);
  assert.doesNotMatch(homeView.innerHTML, new RegExp(unsafeTitle));
  assert.doesNotMatch(homeView.innerHTML, new RegExp(unsafeSummary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
