import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "dist/index.html",
  "dist/cv/index.html",
  "dist/404.html",
  "dist/files/Adamo_Orsini_CV.pdf",
  "dist/files/CommunityGrid_Poster.pdf",
];

const requiredAnchors = [
  "about",
  "research",
  "projects",
  "experience",
  "education",
  "awards",
  "contact",
];

const failures = [];

for (const file of requiredFiles) {
  try {
    await access(file, constants.R_OK);
  } catch {
    failures.push(`Missing build output: ${file}`);
  }
}

let homepage = "";
try {
  homepage = await readFile("dist/index.html", "utf8");
} catch {
  // The missing-file failure above is more useful than a second read error.
}

for (const anchor of requiredAnchors) {
  if (!homepage.includes(`id="${anchor}"`)) {
    failures.push(`Homepage is missing #${anchor}`);
  }
}

for (const text of [
  "TODO(adamo)",
  "Adamo_Orsini_Resume_2026.pdf",
  "primaryBlue",
]) {
  if (homepage.includes(text)) {
    failures.push(`Homepage still contains forbidden text: ${text}`);
  }
}

try {
  await access("dist/dev-hero/index.html", constants.F_OK);
  failures.push("Temporary /dev-hero route is still being emitted");
} catch {
  // Expected: the development-only route must not ship.
}

try {
  const sitemap = await readFile("dist/sitemap-0.xml", "utf8");
  if (sitemap.includes("dev-hero")) {
    failures.push("Temporary /dev-hero route is present in the sitemap");
  }
} catch {
  failures.push("Missing sitemap output: dist/sitemap-0.xml");
}

if (failures.length > 0) {
  console.error("Build verification failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Build verification passed: routes, anchors, files, and sitemap are coherent.");
