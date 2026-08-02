import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the bilingual fashion portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>YOUR NAME — Fashion Print Designer \/ 服装图案设计师<\/title>/i);
  assert.match(html, /24 个图案实验/);
  assert.match(html, /STATIC GARDEN/);
  assert.match(html, /CONCEPT PORTFOLIO \/ NON-COMMERCIAL|概念作品集 \/ 非商业项目/);
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
});

test("ships 24 concept boards and the required interaction contracts", async () => {
  const [page, css, projects, assets] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/projects.ts", import.meta.url), "utf8"),
    readdir(new URL("../public/projects/", import.meta.url)),
  ]);
  assert.equal(assets.filter(name => name.endsWith(".jpg")).length, 24);
  assert.equal((projects.match(/^  \["[a-z0-9-]+"/gm) ?? []).length, 24);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /searchParams\.set\("case"/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /loading="lazy"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /width:min\(82vw,1480px\)/);
  await access(new URL("../public/og.png", import.meta.url));
});
