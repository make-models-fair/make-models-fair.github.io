import { readFile } from "node:fs/promises";

import { parse } from "@retorquere/bibtex-parser";

const bibliographyPath = "assets/bibliographies/publications.bib";
const modelsCsvUrl =
  process.env.MODELS_CSV_URL ??
  "https://raw.githubusercontent.com/make-models-fair/coordination/main/data/models.csv";

// models.csv currently reuses santos-etal-2006 for two different publications.
const keyOverrides = new Map([
  ["10.1098/rspb.2005.3272", "santos-rodrigues-pacheco-2006"],
]);

const normalizeDoi = (value) =>
  value
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .toLowerCase();

const parseCsv = (source) => {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift();
  return rows
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
    );
};

const response = await fetch(modelsCsvUrl);
if (!response.ok) {
  throw new Error(`Could not fetch models.csv (${response.status} ${response.statusText})`);
}

const models = parseCsv(await response.text());
const bibliography = parse(await readFile(bibliographyPath, "utf8"));
if (bibliography.errors.length > 0) {
  throw new Error(
    `Invalid BibTeX:\n${bibliography.errors.map(({ error }) => error).join("\n")}`,
  );
}

const problems = [];
const modelsByDoi = new Map();
for (const model of models) {
  const doi = normalizeDoi(model.article_doi);
  const expectedKey = keyOverrides.get(doi) ?? model.name_short.trim();
  if (!doi) problems.push(`models.csv row has no article_doi: ${model.name_short}`);
  if (!expectedKey) problems.push(`models.csv row has no name_short: ${doi}`);
  if (modelsByDoi.has(doi)) problems.push(`models.csv contains duplicate DOI: ${doi}`);
  modelsByDoi.set(doi, { expectedKey });
}

const bibliographyByDoi = new Map();
const bibliographyKeys = new Set();
for (const entry of bibliography.entries) {
  const doi = normalizeDoi(entry.fields.doi ?? "");
  if (!doi) problems.push(`BibTeX entry has no DOI: ${entry.key}`);
  if (bibliographyKeys.has(entry.key)) problems.push(`BibTeX contains duplicate key: ${entry.key}`);
  if (bibliographyByDoi.has(doi)) problems.push(`BibTeX contains duplicate DOI: ${doi}`);
  bibliographyKeys.add(entry.key);
  bibliographyByDoi.set(doi, entry);
}

for (const [doi, { expectedKey }] of modelsByDoi) {
  const entry = bibliographyByDoi.get(doi);
  if (!entry) {
    problems.push(`Missing BibTeX entry for ${expectedKey} (${doi})`);
  } else if (entry.key !== expectedKey) {
    problems.push(`BibTeX key for ${doi} is ${entry.key}; expected ${expectedKey}`);
  }
}

for (const [doi, entry] of bibliographyByDoi) {
  if (!modelsByDoi.has(doi)) problems.push(`BibTeX entry is not in models.csv: ${entry.key} (${doi})`);
}

if (problems.length > 0) {
  throw new Error(`Bibliography is out of sync:\n- ${problems.join("\n- ")}`);
}

console.log(
  `Bibliography is synchronized: ${bibliography.entries.length} entries match ${models.length} models.`,
);
