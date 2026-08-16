import { readFile, rename, rm, writeFile } from "node:fs/promises";

import { parse } from "@retorquere/bibtex-parser";

const bibliographyPath = "assets/bibliographies/publications.bib";
const modelsCsvPath = "assets/data/models.csv";
const modelsJsonPath = "data/models.json";
const expectedHeaders = [
  "publication_citation",
  "domain",
  "available_code",
  "license",
  "doi",
  "documentation",
  "clean_code",
  "status",
  "issue_link",
  "name_short",
  "article_doi",
  "doi_link",
  "citation_nodoi",
];

// models.csv currently reuses santos-etal-2006 for two different publications.
const keyOverrides = new Map([
  ["10.1098/rspb.2005.3272", "santos-rodrigues-pacheco-2006"],
]);
const allowedValues = {
  domain: new Set(["Cooperation", "Crowd Dynamics", "Ecological Processes", "Land Use"]),
  available_code: new Set(["N", "Y"]),
  license: new Set(["N", "Y"]),
  doi: new Set(["N", "Y"]),
  documentation: new Set(["", "A", "B", "C", "D", "E"]),
  clean_code: new Set(["", "A", "B", "C", "D", "E"]),
  status: new Set([
    "Not yet started",
    "Looking for collaborators",
    "In progress",
    "Meets FAIR criteria!",
  ]),
};

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

  if (quoted) throw new Error(`${modelsCsvPath} contains an unterminated quoted field.`);

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift() ?? [];
  if (headers.length !== expectedHeaders.length ||
      headers.some((header, index) => header !== expectedHeaders[index])) {
    throw new Error(
      `${modelsCsvPath} schema changed. Expected headers:\n${expectedHeaders.join(",")}`,
    );
  }

  return rows.filter((values) => values.some(Boolean)).map((values, rowIndex) => {
    if (values.length !== headers.length) {
      throw new Error(
        `${modelsCsvPath} row ${rowIndex + 2} has ${values.length} fields; expected ${headers.length}.`,
      );
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
};

const models = parseCsv(await readFile(modelsCsvPath, "utf8"));
const bibliography = parse(await readFile(bibliographyPath, "utf8"));
if (bibliography.errors.length > 0) {
  throw new Error(
    `Invalid BibTeX:\n${bibliography.errors.map(({ error }) => error).join("\n")}`,
  );
}

const problems = [];
const modelsByDoi = new Map();
const modelKeys = new Set();
for (const model of models) {
  const doi = normalizeDoi(model.article_doi);
  const expectedKey = keyOverrides.get(doi) ?? model.name_short.trim();
  if (!model.publication_citation.trim()) {
    problems.push(`models.csv row has no publication_citation: ${expectedKey || doi}`);
  }
  if (!model.domain.trim()) problems.push(`models.csv row has no domain: ${expectedKey || doi}`);
  if (!doi) problems.push(`models.csv row has no article_doi: ${model.name_short}`);
  if (!expectedKey) problems.push(`models.csv row has no name_short: ${doi}`);
  for (const [field, allowed] of Object.entries(allowedValues)) {
    if (!allowed.has(model[field])) {
      problems.push(`models.csv ${expectedKey || doi} has invalid ${field}: ${model[field]}`);
    }
  }
  if (model.issue_link &&
      !/^https:\/\/github\.com\/make-models-fair\/coordination\/issues\/\d+$/.test(model.issue_link)) {
    problems.push(`models.csv ${expectedKey || doi} has invalid issue_link: ${model.issue_link}`);
  }
  if (modelsByDoi.has(doi)) problems.push(`models.csv contains duplicate DOI: ${doi}`);
  if (modelKeys.has(expectedKey)) problems.push(`models.csv resolves to duplicate key: ${expectedKey}`);
  modelKeys.add(expectedKey);
  modelsByDoi.set(doi, { expectedKey });
}

const bibliographyByDoi = new Map();
const bibliographyKeys = new Set();
for (const entry of bibliography.entries) {
  const doi = normalizeDoi(entry.fields.doi ?? "");
  for (const field of ["title", "author", "year", "doi"]) {
    const value = entry.fields[field];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      problems.push(`BibTeX entry ${entry.key} has no ${field}`);
    }
  }
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

const temporaryModelsJsonPath = `${modelsJsonPath}.${process.pid}.tmp`;
try {
  await writeFile(temporaryModelsJsonPath, `${JSON.stringify(models, null, 2)}\n`, "utf8");
  await rename(temporaryModelsJsonPath, modelsJsonPath);
} finally {
  await rm(temporaryModelsJsonPath, { force: true });
}

console.log(
  `Bibliography is synchronized: ${bibliography.entries.length} entries match ${models.length} models.`,
);
