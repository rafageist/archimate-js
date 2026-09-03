# archimate-js

An open-source browser modeler for ArchiMate diagrams, built on
[diagram-js](https://github.com/bpmn-io/diagram-js). This fork introduces an
incremental ArchiMate 4 foundation with 42 native concepts, a canonical
relationship engine, complete palette artwork, XML persistence, and a standalone demo.

ArchiMate is a registered trademark of The Open Group.

## Try the modeler locally

Requirements: Node.js 20 or newer and Corepack.

```bash
git clone git@github.com:rafageist/archimate-js.git
cd archimate-js
corepack yarn install --immutable
corepack yarn demo
```

Vite opens the standalone editor at `http://localhost:3000`. The demo includes:

- a complete modeling canvas and ArchiMate 4 palette;
- new, import, and export actions;
- browser-local save and restore;
- zoom controls;
- an interactive, searchable 42 × 42 relationship matrix.

The demo deliberately has no backend. “Save locally” stores XML in the current
browser's `localStorage`; “Export” downloads a portable `.archimate` file.

Imports are strict and transactional: unsupported concepts, unresolved references,
invalid graphical connections, or render failures reject the complete file and
leave the currently open model unchanged. Compatibility is based on structures
the engine understands rather than trusting a particular producer or version label.

## Build a static demo

```bash
corepack yarn demo:build
corepack yarn demo:preview
```

`demo:build` creates `demo-dist/`, a static site with relative asset URLs. Upload
that directory to GitHub Pages, Netlify, an object store, or any ordinary web
server. To serve it with the included dependency instead:

```bash
corepack yarn http-server demo-dist
```

Opening `demo-dist/index.html` directly with a `file://` URL is not recommended;
browsers restrict JavaScript modules and local resources. Use an HTTP server.

## Use it as a library

```js
import Modeler from 'archimate-js';
import 'diagram-js/assets/diagram-js.css';
import 'archimate-js/assets/archimate-js.css';
import 'archimate-js/assets/palette-icons.css';

const modeler = new Modeler({ container: '#canvas' });
await modeler.createNewModel();

const { xml } = await modeler.saveXML({ format: true });
await modeler.importXML(xml);
```

The host page must give the canvas an explicit height:

```css
html, body, #canvas {
  width: 100%;
  height: 100%;
  margin: 0;
}
```

The generated UMD artifact is available after `corepack yarn build`:

```text
dist/archimate-modeler.production.min.js
```

It exposes `window.ArchimateJS` for applications that do not use ES modules.

## ArchiMate 4 relationship API

The Modeler constructor exposes the same relationship data used by interactive
modeling and import validation:

```js
const relationships = Modeler.Archimate4Relationships;

relationships.canConnect('Resource', 'Assignment', 'Capability'); // true
relationships.getAllowedRelationships('ApplicationComponent', 'DataObject');
relationships.getRelationshipCell('Resource', 'Capability');
relationships.getRelationshipMatrix();
```

The canonical CSV fixture contains 3,342 allowed triples across 42 concepts and
11 relationship types. It is compiled to JavaScript at build time; CSV is never
parsed during browser connection attempts. Combinations absent from the matrix
are denied by default.

## Development

```bash
corepack yarn install --immutable
corepack yarn test --runInBand
corepack yarn build
corepack yarn demo:build
```

Useful commands:

| Command | Purpose |
| --- | --- |
| `corepack yarn demo` | Run the editable standalone demo on port 3000 |
| `corepack yarn demo:build` | Generate the deployable `demo-dist/` site |
| `corepack yarn demo:preview` | Preview the generated static site on port 4173 |
| `corepack yarn generate:relationships` | Recompile the normalized relationship CSV |
| `corepack yarn test --runInBand` | Run unit, conformance, and modeling tests |
| `corepack yarn build` | Build the UMD library distribution |

See [BUILDING.md](BUILDING.md) for provenance, build outputs, browser smoke tests,
and compatibility notes.

## Project structure

```text
assets/                 Modeler styles and SVG palette icons
archimate-font/         ArchiMate icon font
examples/standalone/    Framework-free demo source
lib/                    Modeler and language-engine source
resources/archimate4/   Machine-readable ArchiMate 4 resources
test/                   Browser and unit smoke tests
tools/                  Build-time generators
```

## Current compatibility boundary

The browser runtime uses the inherited ArchiMate 3.x exchange namespace as a
compatibility serialization profile while preserving the 42 native ArchiMate 4
concept identities and `languageVersion="4.0"`. Legacy unmarked 3.x XML remains
importable. The supplied relationship dataset represents the allowed set and
does not claim direct-versus-derived provenance.

## License

MIT. See [LICENSE](LICENSE).
