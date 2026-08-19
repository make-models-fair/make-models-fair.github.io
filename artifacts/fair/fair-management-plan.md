# FAIR Management Plan

> Living stewardship plan for the Making Models FAIR website and its managed digital research objects.

## Project Information

| Field | Value |
|---|---|
| Project | Making Models FAIR |
| Acronym | MMF |
| Plan version | 0.1 |
| Date | 2026-08-15 |
| Principal investigator | Unknown |
| FAIR stewards | Repository maintainers; individual responsibilities are not yet recorded |
| Repository | <https://github.com/make-models-fair/make-models-fair.github.io> |
| License | CC0-1.0 |

## Executive Summary

Making Models FAIR is a community initiative and website for improving the findability, accessibility, interoperability, and reusability of computational models. The repository manages the website software and documentation, a curated publication bibliography, a pinned snapshot of the model catalog maintained in the coordination repository, and a small vocabulary for the catalog's model domains.

The current stewardship strategy uses version control, an exact container toolchain, a commit-pinned external catalog, validation before rendering, DOI-normalized bibliography records, Schema.org and SKOS metadata, and automated publication through GitHub Pages. The intended next packaging layer is an RO-Crate 1.3 research object that can aggregate model descriptions, publications, software, data, workflows, assessments, and provenance. This planned aggregation may support a future SciPod concept, but no nonstandard SciPod metadata type is asserted by this project.

## Research Object Inventory

Each managed research object appears once in this canonical inventory.

| Research object | Type | Description | Repository or location | Identifier | Status |
|---|---|---|---|---|---|
| Website source | Research software | Hugo/Docsy source, layouts, assets, validation scripts, and containerized build workflow | This repository | Git commit; no release PID | Managed, active |
| Website content | Documentation | Initiative guidance, process documentation, model catalog pages, and news | `content/en/` in this repository | Git commit; page URLs after publication | Managed, active |
| Model publication bibliography | Dataset | Curated BibTeX metadata for publications represented in the model catalog | `assets/bibliographies/publications.bib` in this repository | DOI per record; Git commit for the collection | Managed, validated |
| Coordination model catalog | Dataset | Source CSV containing model publication, assessment, status, and repository fields | `make-models-fair/coordination:data/models.csv` | Source Git commit and SHA-256 recorded in `model-catalog.lock.json` | Externally maintained, locked locally |
| Model-domain vocabulary | Controlled vocabulary | Project labels and reviewed broad mappings for four model domains | `data/model_domains.yaml` in this repository | Git commit; term IRIs derived from the published model index | Initial version |
| Rendered website | Derived digital object | Static HTML, search index, machine-readable page metadata, assets, and bibliography download | GitHub Pages deployment; generated `public/` locally | Deployment URL and source Git commit | Rebuilt on accepted changes |

Generated intermediates such as `assets/data/models.csv` and `data/publications.json` are transformations of inventoried objects, not independently managed research objects.

## Findability

### Persistent Identifiers

- Publication records use DOI identifiers where available and required by the current validator.
- Website and catalog versions are identified by immutable Git commit hashes.
- The website source, rendered website, catalog collection, and vocabulary do not currently have archival PIDs or DOIs.
- Contributor ORCIDs, affiliations, and formal role assignments are unknown and must be collected before an archival release.

### Metadata

- BibTeX is canonical for publication citation metadata; generated JSON is a build derivative.
- The coordination CSV is canonical for model catalog status and assessment data; this repository pins a source commit rather than maintaining a second copy.
- Model-domain pages expose Schema.org `CollectionPage` and `DefinedTerm` JSON-LD. Broad external alignments use `skos:closeMatch`, not identity claims.
- A future aggregate package should use RO-Crate 1.3 JSON-LD. Software-level CodeMeta and citation metadata remain planned.
- DataCite metadata should be added if the website, bibliography collection, or aggregate package is deposited with a DOI.

### Discovery

The published website provides navigation, taxonomy pages, offline search, model tables, and a publication bibliography. GitHub provides repository discovery and version history. Search-engine indexing is enabled. Machine-readable metadata is currently page-scoped and does not yet describe a complete aggregate research object.

## Accessibility

### Repository Strategy

- GitHub is the working repository for source, issues, reviews, and automation.
- GitHub Pages publishes the rendered website.
- The coordination repository is authoritative for the model catalog CSV.
- Zenodo, Software Heritage, CoMSES Net, or another preservation repository has not yet been selected for an archival release.

### Access Conditions

The repository and website are publicly accessible without authentication. GitHub authentication is required to propose changes through the hosted contribution workflow. No sensitive or controlled data are currently managed in this repository.

### Preservation

Git history and GitHub Pages provide operational versioning, but they are not a complete preservation strategy. Before a stable release, maintainers should archive a tagged source release and its RO-Crate in a repository that issues persistent identifiers, and record the resulting DOI or SWHID here. Retention period and named preservation responsibility are currently unknown.

## Interoperability

- Source content uses Markdown/HTML, configuration uses YAML, model data use CSV, publications use BibTeX and derived JSON, and metadata use JSON-LD.
- Page metadata uses Schema.org and SKOS. Future software and package metadata should use CodeMeta and RO-Crate 1.3; provenance should use W3C PROV-O or the RO-Crate provenance profile.
- Model domains use project-preferred labels with broad Wikidata links expressed as `skos:closeMatch`. These mappings require maintainer review when domain scope changes.
- The coordination CSV schema is validated exactly and normalized to named JSON records before rendering; templates do not access positional columns.
- The absence of an authoritative SciPod vocabulary is an explicit interoperability limitation. The project will model aggregate objects with established standards rather than inventing an incompatible type.

## Reusability

Build and maintenance workflows are documented in `README.md`, tool versions are exact, and rendering occurs in a Docker Compose toolchain. The model snapshot and bibliography are checked together before publication. Git records changes and review history.

Known limitations are the lack of release citation metadata, archival identifiers, contributor role metadata, a formal preservation target, and an aggregate RO-Crate. Model publications and externally maintained repositories retain their own rights and licenses; this repository's CC0 dedication does not relicense them.

## Provenance

The model catalog snapshot is fetched from the repository, path, and commit in `model-catalog.lock.json`, then verified against its SHA-256 checksum. The build validates its schema and synchronizes its 94 publication DOIs against the canonical BibTeX bibliography. Bibliography JSON and the static website are generated only after validation. GitHub Actions records the source commit and build run for deployments. Scheduled automation proposes lock changes by pull request so bibliography and catalog changes can be reviewed together.

Future RO-Crate packaging should record these relationships using W3C PROV-O or the RO-Crate provenance profile, including the source commit, toolchain versions, transformation commands, generated objects, and deployment. A machine-readable provenance manifest is not yet maintained.

## Computational Environment

- Hugo Extended is pinned in `HUGO_VERSION` and used through the official Hugo container image.
- Node dependencies, including Docsy, bibliography parsing, and Mermaid, are exact in `package.json` and `package-lock.json`.
- Docker Compose mounts the working tree into a toolchain-only image. `make build`, `make render`, `make serve`, and `make bibliography-check` are the supported interfaces.
- The build requires network access to fetch the commit-pinned coordination CSV. Runtime website rendering does not require that source service.

## Licensing

The website repository uses the CC0-1.0 public-domain dedication. Dependency licenses are represented by their packages and lockfile but have not been consolidated into a reviewed inventory. Publication metadata and model catalog facts may have different rights considerations from the surrounding software. Licenses for linked model implementations, input data, and workflows must be recorded by each model-level package; unknown rights must not be inferred from this repository's license.

## Roles and Responsibilities

Repository maintainers currently review content, metadata, software, catalog pins, and deployments through pull requests. Named responsibility for FAIR review, vocabulary stewardship, preservation, and archival deposits is unknown. These assignments, contributor identities, ORCIDs, affiliations, and credit roles should be added before an archival release.

## Resources

Current infrastructure uses GitHub repositories, Actions, and Pages plus public package and source hosting. Storage, identifier registration, curation effort, archival costs, and long-term preservation funding are unknown. The project should estimate these when selecting an archival repository and defining a release cadence.

## Security and Ethics

Automation has least-privilege defaults: the site build is read-only, while the scheduled updater receives scoped write access only to create a reviewable branch, pull request, and validation dispatch. External CSV content is treated as data, validated, and never executed. Dependencies and GitHub Actions remain supply-chain inputs and require periodic review.

This repository does not currently manage personal or sensitive research data. FAIR packaging alone does not resolve consent, authority, collective benefit, or other ethical questions associated with models and their source data; those concerns require model-specific governance review.

## FAIR Assessment

| Principle | Status | Notes |
|---|---|---|
| Findable | Partial | DOI-backed publications, search, taxonomy pages, and JSON-LD exist; collection-level PIDs and complete metadata are missing. |
| Accessible | Partial | Source and site are public; preservation location and long-term access policy are not defined. |
| Interoperable | Partial | Open formats, Schema.org, SKOS, named catalog records, and exact schema validation are used; CodeMeta, RO-Crate, and richer model metadata remain planned. |
| Reusable | Partial | License, documentation, exact dependencies, and validation exist; citation metadata, role metadata, license inventory, archival releases, and complete provenance are missing. |

## Planned Improvements

1. Review domain mappings and publish the vocabulary as part of an RO-Crate 1.3 metadata graph.
2. Define a model-level crate profile connecting each publication, implementation, data dependency, workflow, assessment, and provenance record.
3. Add canonical `codemeta.json` and derive consistent `CITATION.cff` metadata for an identified release.
4. Select an archival repository, mint persistent identifiers, and record retention and preservation responsibility.
5. Capture named steward roles, ORCIDs, affiliations, contributor roles, and model-level rights information.
6. Add a machine-readable provenance manifest when the RO-Crate workflow is implemented.

## Review History

| Version | Date | Summary |
|---|---|---|
| 0.1 | 2026-08-15 | Initial inventory, current controls, metadata strategy, unknowns, and RO-Crate/SciPod roadmap. |

## Derived Management Plans

No funder-facing DMP or SMP is currently required. Any future plan must be derived from this FAIR Management Plan, and new stewardship decisions discovered during that process must first be recorded here.

## Related Artifacts

- `README.md`
- `LICENSE`
- `model-catalog.lock.json`
- `assets/bibliographies/publications.bib`
- `data/model_domains.yaml`
