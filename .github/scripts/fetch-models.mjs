import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

const lockPath = "model-catalog.lock.json";
const outputPath = "assets/data/models.csv";
const lock = JSON.parse(await readFile(lockPath, "utf8"));

if (!/^[\w.-]+\/[\w.-]+$/.test(lock.repository)) {
  throw new Error(`${lockPath} repository must be an owner/repository name.`);
}
if (!lock.path || lock.path.startsWith("/") || lock.path.split("/").includes("..")) {
  throw new Error(`${lockPath} path must be relative and cannot contain '..'.`);
}
if (!/^[0-9a-f]{40}$/.test(lock.commit)) {
  throw new Error(`${lockPath} commit must be one full lowercase commit SHA.`);
}
if (!/^[0-9a-f]{64}$/.test(lock.sha256)) {
  throw new Error(`${lockPath} sha256 must be one lowercase SHA-256 digest.`);
}

const sourcePath = lock.path.split("/").map(encodeURIComponent).join("/");
const sourceUrl = `https://raw.githubusercontent.com/${lock.repository}/${lock.commit}/${sourcePath}`;

let sourceBytes;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  try {
    const response = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "make-models-fair.github.io model snapshot fetcher",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    sourceBytes = Buffer.from(await response.arrayBuffer());
    if (sourceBytes.length === 0) throw new Error("response was empty");
    if (sourceBytes.length > 5_000_000) throw new Error("response exceeded 5 MB");
    break;
  } catch (error) {
    if (attempt === 3) {
      throw new Error(`Could not fetch ${lock.path} at ${lock.commit}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
  }
}

const checksum = createHash("sha256").update(sourceBytes).digest("hex");
if (checksum !== lock.sha256) {
  throw new Error(
    `${lock.path} checksum mismatch at ${lock.commit}: expected ${lock.sha256}, received ${checksum}`,
  );
}

await mkdir(dirname(outputPath), { recursive: true });
const temporaryPath = `${outputPath}.${process.pid}.tmp`;
try {
  await writeFile(temporaryPath, sourceBytes);
  await rename(temporaryPath, outputPath);
} finally {
  await rm(temporaryPath, { force: true });
}

console.log(`Fetched ${lock.repository}/${lock.path} at ${lock.commit} (${checksum}).`);
