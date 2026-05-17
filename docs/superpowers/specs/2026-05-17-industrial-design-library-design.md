# Industrial Design Library Website Specification

Date: 2026-05-17
Status: Approved direction, ready for implementation planning
Project: Industrial design content library website

## 1. Product Positioning

This website should become a long-running industrial design content library, not only a portfolio landing page.

The homepage should feel like a curated editorial entry point. It should help visitors quickly understand the major content areas, see selected work, and browse recent design thinking. Detailed project pages should carry the more formal portfolio role, while notes, experiments, inspiration, and methods should make the site feel alive and continuously updated.

The tone should combine:

- Research notebook: process, observations, judgment, iteration, and unfinished thinking are welcome.
- Curated design library: content is organized, selected, and indexed rather than dumped chronologically.
- Portfolio credibility: finished projects remain easy to find and suitable for clients, collaborators, recruiters, and design peers.

## 2. Reference and Existing Context

The current site already implements the primary card interaction inspired by Interface Craft. That interaction should remain the first-viewport navigation pattern.

The reference site's useful pattern is the way the opening cards act as a content-library gateway. This project should preserve that structural idea while replacing the subject matter with industrial design: works, process, inspiration, experiments, and methods.

The existing implementation is intentionally lightweight:

- `index.html` contains the current card-based landing page.
- `tests/card-replica.test.js` verifies the card structure, animation hooks, and selected/minimized states.

The next implementation should extend this existing page rather than replace the card interaction.

## 3. Primary Audience

The site should serve three overlapping audiences:

- Design peers who want to browse industrial design observations, references, methods, and experiments.
- Clients, collaborators, or hiring reviewers who need to see finished work and project credibility.
- The owner of the site, who needs a durable system for collecting and connecting design thinking over time.

The primary mode is content library. Portfolio and personal brand value should emerge from the quality of the organization and writing.

## 4. Information Architecture

The homepage should use five primary card entries:

| Section | Display Label | Purpose |
| --- | --- | --- |
| Works | Works | Finished projects, formal case studies, portfolio-ready work |
| Process | Process | Research, sketching, CAD, prototypes, iteration logs, design decisions |
| Inspiration | Inspiration | Product observations, materials, structures, brands, exhibitions, trends |
| Experiments | Experiments | Concepts, AI-assisted studies, parametric work, CMF tests, unfinished ideas |
| Methods | Methods | Industrial design methods, toolchains, manufacturing notes, judgment frameworks |

Chinese UI labels can be added during implementation. The specification keeps display labels in ASCII so the document remains readable across the current Windows shell and editor setup.

Secondary navigation should eventually include:

- Archive: all published content by date and category.
- Index: aggregated tags, materials, tools, processes, and themes.
- About: background, design direction, contact, and selected credibility markers.

Archive and Index are not required in the first implementation unless they are cheap to include.

## 5. Content Model

All content items should share a base model:

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | Yes | Display title |
| `slug` | Yes | Stable URL segment |
| `category` | Yes | One of `works`, `process`, `inspiration`, `experiments`, `methods` |
| `summary` | Yes | One or two sentences for homepage and listing cards |
| `cover` | Yes | Primary image or thumbnail |
| `date` | Yes | Publication or record date |
| `status` | Yes | `draft`, `published`, or `featured` |
| `tags` | Yes | Browsing and cross-linking keywords |
| `body` | Yes | Main written content |
| `materials` | No | Material or CMF references |
| `tools` | No | Tools used, such as Rhino, KeyShot, Blender, Midjourney, or physical tools |
| `related` | No | Slugs for connected notes, works, experiments, or references |

The first implementation may store this data in static JavaScript or JSON. A CMS is not required for the first version.

## 6. Content Type Extensions

### Works

Works are formal case studies. They should be polished enough for portfolio use while still showing decisive process.

Additional fields:

| Field | Purpose |
| --- | --- |
| `projectType` | Product category, such as furniture, consumer electronics, homeware, or mobility |
| `role` | Responsibilities and contribution |
| `year` | Project year |
| `duration` | Project duration |
| `brief` | Design brief or prompt |
| `problem` | Problem or opportunity |
| `outcome` | Final result |
| `processHighlights` | Three to five important process moments |
| `gallery` | Final images, process images, details, and prototypes |
| `reflection` | What worked, what changed, and what the next version would improve |

Recommended page flow:

1. Hero image and project summary.
2. Brief, role, year, duration, tools, and materials.
3. Problem and design intent.
4. Process highlights.
5. Final outcome.
6. Details, materials, structure, or manufacturing considerations.
7. Reflection and related notes.

### Process

Process entries should feel like studio records. They do not need to be finished or portfolio-polished.

Additional fields:

| Field | Purpose |
| --- | --- |
| `linkedWork` | Related finished work, if any |
| `stage` | `research`, `sketch`, `cad`, `prototype`, `test`, or `refinement` |
| `question` | What this process entry is trying to answer |
| `inputs` | References, constraints, sketches, prototypes, or test setup |
| `iterations` | Alternative versions or comparison points |
| `decision` | Why a direction was chosen |
| `nextStep` | What should be tested next |

Recommended page flow:

1. What is being explored.
2. Key images, sketches, or artifacts.
3. Iteration comparison.
4. Decision and reasoning.
5. Next step and related project.

### Inspiration

Inspiration entries should be lightweight but opinionated. The site should avoid becoming a passive image dump.

Additional fields:

| Field | Purpose |
| --- | --- |
| `source` | Link, exhibition, book, brand, place, object, or credit |
| `sourceType` | `product`, `material`, `brand`, `exhibition`, `object`, or `trend` |
| `whyItMatters` | Why this reference deserves attention |
| `designObservation` | Specific observation about structure, proportion, interaction, material, or CMF |
| `applicableTo` | How this could inform future work |
| `imageCredits` | Credit and rights notes when relevant |

Recommended page flow:

1. Image set.
2. One-sentence judgment.
3. Observation points.
4. Possible applications.
5. Tags and related content.

### Experiments

Experiments can be unfinished. They should emphasize hypothesis, variables, and what was learned.

Additional fields:

| Field | Purpose |
| --- | --- |
| `hypothesis` | What the experiment is testing |
| `method` | How the experiment was done |
| `variables` | Shape, material, proportion, prompt, fabrication, or other changing parameters |
| `outputs` | Images, models, renders, motion, or result sets |
| `evaluation` | What worked and what failed |
| `reusableLearning` | A finding that can be reused elsewhere |

Recommended page flow:

1. Hypothesis.
2. Method.
3. Result matrix.
4. Evaluation.
5. Next possible direction.

### Methods

Methods should capture reusable design judgment and workflows.

Additional fields:

| Field | Purpose |
| --- | --- |
| `topic` | Method topic |
| `context` | When the method is useful |
| `principle` | Core principle |
| `steps` | Practical workflow |
| `example` | Concrete example |
| `pitfalls` | Common mistakes |
| `templates` | Reusable checklist, table, prompt, or framework |

Recommended page flow:

1. Situation or problem.
2. Principle.
3. Steps.
4. Example.
5. Pitfalls and reusable template.

## 7. Page Structure

### Homepage

The homepage should keep the existing first-viewport card animation and extend below it.

Recommended order:

1. Opening five-card section.
2. Featured Works: two or three representative projects.
3. Recent Notes: recent process, inspiration, or methods entries.
4. Material / CMF Watch: material, finish, color, and manufacturing observations.
5. Studio Experiments: concepts, AI studies, parametric studies, structure, and form experiments.
6. Reading the Index: tag entry points such as material, furniture, structure, CMF, manufacturing, AI, sketching, prototype, and ergonomics.

Homepage modules should feel curated. Each module should show a small number of selected items rather than a long feed.

### Category Pages

Each primary card should route to a category page. Category pages should share the same base structure:

1. Category title and short editorial description.
2. Featured items in that category.
3. Filters by tag, material, year, tool, stage, or source type where relevant.
4. Content card grid.
5. Related tags.
6. Cross-link to a related section.

Category cards should be image-led. Text should be concise and support scanning.

### Detail Pages

Only three detail templates are needed for the first version:

| Template | Categories | Purpose |
| --- | --- | --- |
| Case Study | Works | Formal portfolio-quality project story |
| Research Note | Process, Inspiration, Methods | Lighter written note with images and judgment |
| Experiment Log | Experiments | Hypothesis, method, outputs, and learning |

This reduces implementation and maintenance cost while still giving each content mode an appropriate shape.

## 8. MVP Scope

The first implementation should include:

- Replace the current card labels and descriptions with industrial design sections.
- Keep the existing card motion, hover, selected, minimized, and Escape behavior.
- Add a curated homepage section below the card stage.
- Define a static content data source with sample items for all five categories.
- Render Featured Works, Recent Notes, Material / CMF Watch, Studio Experiments, and tag index modules from that data.
- Add basic category views, either as in-page filtered sections or separate lightweight pages.
- Add detail template structures for Case Study, Research Note, and Experiment Log.
- Support tags, featured status, related content, gallery images, materials, and tools in the data model.

The first implementation should avoid:

- Full CMS integration.
- Authentication.
- Newsletter signup.
- Complex full-text search.
- Heavy animation beyond the existing card interaction.
- Overbuilding Archive and Index pages before enough content exists.

## 9. Future Roadmap

### Phase 2

- Archive page for all content by date and category.
- Index page for tags, materials, tools, processes, and themes.
- Search over titles, summaries, tags, materials, tools, and body text.
- Material / CMF index with richer metadata.
- Project process timelines linking works to process notes, inspiration, and experiments.

### Phase 3

- Moodboard collections for themed inspiration sets.
- Compare view for form, CMF, or concept alternatives.
- Newsletter or updates page for personal brand growth.
- More complete About page with selected work, contact, services, and design perspective.
- Multi-language content support if the site needs both Chinese and English audiences.

## 10. Success Criteria

The first version succeeds if:

- The opening card interaction still feels like the memorable navigation centerpiece.
- A new visitor understands the five content areas within a few seconds.
- Finished works are easy to find and credible as portfolio material.
- Process, inspiration, experiments, and methods feel intentionally organized rather than miscellaneous.
- The owner can add new content without redesigning the site structure each time.
- Tags and related links begin to create a useful design knowledge network.

## 11. Implementation Notes

The current site is a single HTML file with embedded CSS and JavaScript. For the next step, there are two reasonable implementation paths:

1. Keep the first version in a single static `index.html`, using embedded sample data and hash-based routing for category/detail views.
2. Split into a small static-site structure with separate data and template files.

Given the current project size, the recommended first implementation path is a single-file or minimal-static approach. This preserves momentum, avoids framework setup, and lets the content model prove itself before introducing more infrastructure.
