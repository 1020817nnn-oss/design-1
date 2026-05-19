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
  const listeners = new Map();

  return {
    dataset: {},
    classList: createClassList(),
    style: {
      setProperty() {},
    },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    dispatchEvent(type, event = {}) {
      listeners.get(type)?.(event);
    },
    removeAttribute() {},
    setAttribute() {},
  };
}

function runInlineScript(html, beforeRender = "") {
  const homeView = { innerHTML: "" };
  const categoryView = { hidden: false, innerHTML: "" };
  const detailView = { hidden: true, innerHTML: "" };
  const stage = {
    dataset: {},
    classList: createClassList(),
  };
  const cardCategories = ["works", "process", "inspiration", "experiments", "methods"];
  const cards = cardCategories.map((category) => {
    const card = createCardStub();
    card.dataset.category = category;
    return card;
  });
  const windowListeners = new Map();
  const location = { hash: "" };
  const script = extractInlineScript(html).replace(/\n\s*renderHome\(\);/, `\n${beforeRender}\n      renderHome();`);
  const context = {
    document: {
      querySelector(selector) {
        if (selector === "#home-view") {
          return homeView;
        }

        if (selector === "#category-view") {
          return categoryView;
        }

        if (selector === "#detail-view") {
          return detailView;
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
    window: {
      location,
      addEventListener(type, handler) {
        windowListeners.set(type, handler);
      },
    },
  };

  vm.runInNewContext(script, context, { timeout: 1000 });

  return { homeView, categoryView, detailView, stage, cards, location, windowListeners };
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

test("category route renders category view and active card second click changes hash", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const beforeRender = `
      window.location.hash = "#category/works";
  `;
  const { homeView, categoryView, cards, location } = runInlineScript(html, beforeRender);

  assert.equal(homeView.hidden, true);
  assert.equal(categoryView.hidden, false);
  assert.match(categoryView.innerHTML, /Works/);
  assert.match(categoryView.innerHTML, /Modular Lamp Handle Study/);
  assert.match(categoryView.innerHTML, /Related Sections/);
  assert.match(categoryView.innerHTML, /href="#category\/process"/);

  location.hash = "";
  cards[0].dispatchEvent("click");
  assert.equal(location.hash, "");

  cards[0].dispatchEvent("click");
  assert.equal(location.hash, "category/works");
});

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
  assert.match(html, /function\s+createItemHref/);
  assert.match(html, /hash\.startsWith\("item\/"\)/);

  const detailRoutes = [
    {
      slug: "modular-lamp-handle-study",
      label: "Case Study",
      expected: "Design a small lamp that can move between desk, shelf, and bedside contexts",
    },
    {
      slug: "foam-model-balance-notes",
      label: "Research Note",
      expected: "Does the handle invite pickup without making the lamp read as a lantern?",
    },
    {
      slug: "parametric-vent-pattern-tests",
      label: "Experiment Log",
      expected: "Grouped vent rhythms can communicate performance",
    },
  ];

  for (const route of detailRoutes) {
    const { homeView, categoryView, detailView } = runInlineScript(html, `
      window.location.hash = "#item/${route.slug}";
    `);

    assert.equal(homeView.hidden, true);
    assert.equal(categoryView.hidden, true);
    assert.equal(detailView.hidden, false);
    assert.match(detailView.innerHTML, new RegExp(route.label));
    assert.match(detailView.innerHTML, new RegExp(route.expected));
  }
});

test("detail routes escape hostile item data and tolerate missing fields", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const unsafeTitle = `Unsafe <Detail> & "Quote" 'Apostrophe'`;
  const unsafeSummary = `Detail summary <script>alert("x")</script> & "quotes"`;
  const unsafeTag = `tag"><script>alert('tag')</script>`;
  const beforeRender = `
      contentItems.push({
        title: ${JSON.stringify(unsafeTitle)},
        slug: "unsafe-detail",
        category: "experiments",
        template: "experiment-log",
        summary: ${JSON.stringify(unsafeSummary)},
        cover: "blue-grid",
        date: "2026-05-13",
        status: "published",
        tags: [${JSON.stringify(unsafeTag)}],
        materials: [],
        tools: [],
        related: [],
        body: "Body with <b>unsafe</b> text.",
        hypothesis: "A <hypothesis> should be escaped.",
        variables: ["slot <radius>", "edge & setback"],
        outputs: []
      });

      contentItems.push({
        category: "works",
        template: "research-note",
        status: "featured",
        body: "Sparse body"
      });

      window.location.hash = "#item/unsafe-detail";
  `;

  const { detailView } = runInlineScript(html, beforeRender);

  assert.match(detailView.innerHTML, /Unsafe &lt;Detail&gt; &amp; &quot;Quote&quot; &#39;Apostrophe&#39;/);
  assert.match(detailView.innerHTML, /Detail summary &lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt; &amp; &quot;quotes&quot;/);
  assert.match(detailView.innerHTML, /tag&quot;&gt;&lt;script&gt;alert\(&#39;tag&#39;\)&lt;\/script&gt;/);
  assert.match(detailView.innerHTML, /Body with &lt;b&gt;unsafe&lt;\/b&gt; text\./);
  assert.match(detailView.innerHTML, /A &lt;hypothesis&gt; should be escaped\./);
  assert.doesNotMatch(detailView.innerHTML, /<script>/);
  assert.doesNotMatch(detailView.innerHTML, new RegExp(unsafeTitle));

  const { homeView, categoryView, detailView: sparseDetailView } = runInlineScript(html, `
      contentItems.push({
        category: "works",
        template: "research-note",
        status: "featured",
        body: "Sparse body"
      });

      contentItems.push({
        slug: "sparse-detail",
        category: "process",
        template: "research-note",
        body: "Sparse body"
      });

      window.location.hash = "#item/sparse-detail";
  `);

  assert.equal(homeView.hidden, true);
  assert.equal(categoryView.hidden, true);
  assert.equal(sparseDetailView.hidden, false);
  assert.doesNotMatch(sparseDetailView.innerHTML, /undefined/);
  assert.match(sparseDetailView.innerHTML, /Untitled Note/);
  assert.match(homeView.innerHTML, /href="#"/);
  assert.match(homeView.innerHTML, /Untitled Note/);
  assert.doesNotMatch(homeView.innerHTML, /undefined/);
});

test("unknown item routes do not crash and safely fall back to home", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const { homeView, categoryView, detailView } = runInlineScript(html, `
      window.location.hash = "#item/not-a-real-item";
  `);

  assert.equal(homeView.hidden, false);
  assert.equal(categoryView.hidden, true);
  assert.equal(detailView.hidden, true);
  assert.equal(detailView.innerHTML, "");
});
