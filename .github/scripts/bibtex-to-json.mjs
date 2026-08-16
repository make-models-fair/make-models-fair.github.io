import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { parse } from "@retorquere/bibtex-parser";

const inputPath = process.argv[2] ?? "assets/bibliographies/publications.bib";
const outputPath = process.argv[3] ?? "data/publications.json";

const formatName = (name) =>
  [name.firstName, name.prefix, name.lastName, name.suffix]
    .filter(Boolean)
    .join(" ");

const formatValue = (value) => {
  if (!Array.isArray(value)) return String(value);
  if (value.every((item) => typeof item === "string")) return value.join(", ");
  return value.map(formatName).join(" and ");
};

const source = await readFile(inputPath, "utf8");
const result = parse(source);

if (result.errors.length > 0) {
  const errors = result.errors.map(({ error }) => error).join("\n");
  throw new Error(`Invalid BibTeX in ${inputPath}:\n${errors}`);
}

const keys = new Set();
const publications = result.entries.map((entry) => {
  if (keys.has(entry.key)) throw new Error(`Duplicate BibTeX key: ${entry.key}`);
  keys.add(entry.key);

  const fields = Object.entries(entry.fields).map(([name, value]) => ({
    name,
    value: formatValue(value),
  }));
  const fieldMap = Object.fromEntries(fields.map(({ name, value }) => [name, value]));

  return {
    key: entry.key,
    type: entry.type,
    sortYear: Number.parseInt(fieldMap.year, 10) || 0,
    fields,
    fieldMap,
    authorList: (entry.fields.author ?? []).map(formatName),
  };
});

publications.sort(
  (left, right) => right.sortYear - left.sortYear || left.key.localeCompare(right.key),
);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(publications, null, 2)}\n`, "utf8");

console.log(`Generated ${outputPath} from ${publications.length} BibTeX entries.`);
