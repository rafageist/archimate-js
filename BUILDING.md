# Browser build

This repository is the maintainable ArchiMate.js source engine. It starts from upstream
`propn/archimate-js` revision `a374190da87b8b51f0a8585aa244990e5bdb85de`
(package 0.0.4). The `upstream` Git remote is read-only reference provenance;
Fork changes live on a separate branch/repository.

## Prerequisites and dependencies

- Node.js 20 or newer
- Corepack
- Yarn 4.9.2 (pinned by `packageManager`)

Install the locked dependency graph:

```console
corepack yarn install --immutable
```

## Build

```console
corepack yarn build
```

The build first compiles
`resources/archimate4/relationships/archimate4_relationships_normalized.csv`
into `lib/archimate4/generated/RelationshipMatrix.generated.js`; browsers never
parse CSV at runtime. Run `corepack yarn generate:relationships` when reviewing
or regenerating that checked-in artifact independently.

The Vite library build exports the full `Modeler` as the UMD global
`ArchimateJS` and bundles its browser dependencies. The generated artifact is:

```text
dist/archimate-modeler.production.min.js
```

Do not edit that artifact manually.

## Verification

```console
corepack yarn test --runInBand
corepack yarn build
```

The engine tests cover model construction/import/export, the ArchiMate 4
registry, all 19,404 matrix combinations, and real relationship modeling and
round-tripping. Odoo integration tests and a browser smoke test cover editor lifecycle,
persistence and record Link/Unlink behavior.

After building, serve the repository and open the smoke page in a browser:

```console
corepack yarn start --host 127.0.0.1
```

Open `http://127.0.0.1:5173/test/browser-smoke.html`. A successful run sets the
page body attribute `data-status="passed"` after loading the generated UMD,
importing and saving XML, checking the Link/Unlink property-update API and reading
the embedded ArchiMate 4 registry.

Open `http://127.0.0.1:5173/test/archimate4-runtime-smoke.html` for the executable
ArchiMate 4 concept test. It creates all 42 concepts through `ElementFactory` and
`modeling`, renders each pictogram, saves XML, reimports it, and verifies every
native type survives the round trip.

## Relationship-rule status

`lib/archimate4/RelationshipRules.js` is the authoritative runtime API used by
the connection UI, reconnect validation, and import validation for models marked
`languageVersion="4.0"`. Unmarked 3.x documents remain on the compatibility
import path. The generic moddle descriptor preserves all 42 native concept type
identities; the XML namespace remains the inherited 3.0 exchange namespace until
an official ArchiMate 4 exchange schema is available. The former ArchiMate 3.x
maps are no longer consulted by active relationship validation. The supplied
normalized CSV contains 3,342 allowed triples across 42 concepts and 11 semantic
relationships. It is the build-time source for `canConnect`, relationship menus,
reconnect/import validation, and the Odoo Relationships Matrix viewer. Combinations
absent from the compiled matrix remain denied by default. The dataset does not
encode direct-versus-derived provenance, so the engine and viewer make no such claim.

Access modes are `unspecified`, `read`, `write`, and `read-write`. Association
modes are `undirected` and `directed`. Influence strength remains an unrestricted
optional string. Junction validation preserves AND/OR identity, requires one
relationship type per chain, and also requires the underlying concept-to-concept
rule to exist in the normative matrix.
