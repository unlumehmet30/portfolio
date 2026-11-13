// Snapshots the public API of the live site into static JSON + asset files.
// Usage: node scripts/export-content.mjs [https://unlumehmet.com]
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const origin = (process.argv[2] ?? "https://unlumehmet.com").replace(/\/$/, "");
const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(frontendRoot, "content");
const publicDir = path.join(frontendRoot, "public");

async function getJson(apiPath) {
  const response = await fetch(`${origin}/api${apiPath}`);
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(`${apiPath}: ${payload?.error?.message ?? response.status}`);
  }

  return payload.data;
}

async function writeJson(name, data) {
  await fs.writeFile(path.join(contentDir, name), `${JSON.stringify(data, null, 2)}\n`);
}

function collectAssetPaths(value, found = new Set()) {
  if (typeof value === "string") {
    for (const match of value.matchAll(/\/api\/uploads\/[^\s"'()<>\]]+/g)) {
      found.add(decodeURI(match[0]));
    }
    if (/^\/[\w./-]+\.(png|jpe?g|webp|gif|svg|pdf|html)$/i.test(value)) {
      found.add(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectAssetPaths(item, found));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectAssetPaths(item, found));
  }

  return found;
}

async function download(assetPath) {
  const target = path.join(publicDir, assetPath);
  const response = await fetch(`${origin}${encodeURI(assetPath)}`);

  if (!response.ok) {
    console.warn(`  ! ${assetPath} -> ${response.status}`);
    return;
  }

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
  console.log(`  + ${assetPath}`);
}

await fs.mkdir(contentDir, { recursive: true });

const [profile, projectList, postList, resume] = await Promise.all([
  getJson("/profile"),
  getJson("/projects"),
  getJson("/posts"),
  getJson("/resume")
]);

const projects = await Promise.all(projectList.map((project) => getJson(`/projects/${project.slug}`)));
const posts = await Promise.all(postList.map((post) => getJson(`/posts/${post.slug}`)));

await writeJson("profile.json", profile);
await writeJson("projects.json", projects);
await writeJson("posts.json", posts);
await writeJson("resume.json", resume);

console.log(`Saved ${projects.length} projects, ${posts.length} posts, profile and resume.`);

const assets = collectAssetPaths([profile, projects, posts, resume]);
console.log(`Downloading ${assets.size} assets...`);
for (const assetPath of assets) {
  await download(assetPath);
}
