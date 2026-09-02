import fs from 'fs';
import path from 'path';

import registry from '../lib/archimate4/Registry';
import { ARCHIMATE4_ELEMENT_MAP } from '../lib/util/ModelUtil';
import { getArchimate4PaletteDefinitions } from '../lib/features/palette/PaletteProvider';
import PathMap from '../lib/draw/PathMap';

describe('ArchiMate 4 canonical registry', () => {
  test('registers every native concept exactly once', () => {
    const ids = registry.concepts.map((entry) => entry.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(42);
  });

  test('keeps removed and merged 3.x concepts outside the native model', () => {
    const native = new Set(registry.concepts.map((entry) => entry.id));

    registry.removedNativeConcepts.forEach((legacyId) => {
      expect(native.has(legacyId)).toBe(false);
      expect(registry.legacyMappings[legacyId]).toBeDefined();
    });
  });

  test.each([ 'Equipment', 'Facility', 'DistributionNetwork', 'Material' ])(
    'classifies %s in Technology and records Physical only as legacy metadata',
    (conceptId) => {
      const concept = registry.getConcept(conceptId);

      expect(concept.domain).toBe('Technology');
      expect(concept.legacyDomain).toBe('Physical');
      expect(registry.domains).not.toContain('Physical');
    }
  );

  test('provides canonical non-text notation for every concept', () => {
    registry.concepts.forEach((entry) => {
      expect(entry.notation.ref).toBeTruthy();
      expect(entry.notation.textualFallback).toBe(false);
      expect(registry.resolveNotation(entry.id)).toBe(entry.notation);
      expect(ARCHIMATE4_ELEMENT_MAP.get(entry.id).notation).toBe(entry.notation);
    });
  });

  test('derives every exposed palette entry from complete registry notation', () => {
    const palette = getArchimate4PaletteDefinitions();
    const pathMap = new PathMap();

    expect(palette.size).toBe(registry.concepts.length);

    palette.forEach((definition, conceptId) => {
      expect(definition.notation.status).toBe('complete');
      expect(definition.notation.rendererAvailable).toBe(true);
      expect(definition.notation.paletteAvailable).toBe(true);
      expect(
        fs.existsSync(path.resolve('assets', 'icons', path.basename(definition.notation.paletteAsset)))
      ).toBe(true);
      expect(pathMap.hasRegistryNotation(conceptId)).toBe(true);
      expect(registry.getConcept(conceptId)).toBeDefined();
    });
  });

  test('keeps every palette asset as vector-only SVG', () => {
    registry.concepts.forEach((concept) => {
      const iconPath = path.resolve(
        'assets',
        'icons',
        path.basename(concept.notation.paletteAsset)
      );
      const svg = fs.readFileSync(iconPath, 'utf8');

      expect(svg).toMatch(/<svg\b/);
      expect(svg).not.toMatch(/<image\b/i);
      expect(svg).not.toMatch(/data:image\//i);
      expect(svg).not.toMatch(/base64/i);
    });
  });

  test('gives every relationship central deny-by-default rule metadata', () => {
    registry.relationships.forEach((relationship) => {
      expect(relationship.rules.source).toBe('archimate4-central-rules');
      expect(relationship.rules.defaultDecision).toBe('deny');
    });
    expect(registry.canConnect('Role', 'Assignment', 'Process')).toBe(false);
  });

  test('separates deterministic and ambiguous legacy transformations', () => {
    const report = registry.analyzeLegacyXml(`
      <archimate:Model xmlns:archimate="http://www.opengroup.org/xsd/archimate/3.0/">
        <element xsi:type="archimate:BusinessRole"/>
        <element xsi:type="archimate:Gap"/>
      </archimate:Model>
    `);

    expect(report.transformations.map((item) => item.legacyType)).toEqual([ 'BusinessRole' ]);
    expect(report.manualReview.map((item) => item.legacyType)).toEqual([ 'Gap' ]);
    expect(report.safeToAutoMigrate).toBe(false);
  });

  test('validates viewpoints and specializations against the same registry', () => {
    const viewpoint = registry.defineViewpoint({
      id: 'example',
      name: 'Example',
      concepts: [ 'Role', 'Process', 'Service' ]
    });

    expect(viewpoint.concepts).toEqual([ 'Role', 'Process', 'Service' ]);
    expect(registry.validateSpecialization({
      baseConcept: 'Requirement',
      name: 'Constraint'
    })).toBe(true);
    expect(() => registry.defineViewpoint({
      id: 'invalid',
      name: 'Invalid',
      concepts: [ 'Gap' ]
    })).toThrow();
  });
});
