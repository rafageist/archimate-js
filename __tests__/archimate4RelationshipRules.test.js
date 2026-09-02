import fs from 'node:fs';
import path from 'node:path';
import registry from '../lib/archimate4/Registry';
import {
  ACCESS_MODES, ASSOCIATION_MODES, canConnect, getAllowedRelationships,
  getRelationshipCell, getRelationshipMatrix, matrixStatus, normalizeAccessMode,
  normalizeAssociationMode, validateJunctionConnection, validateModelRelationships
} from '../lib/archimate4/RelationshipRules';
import { getSemanticType } from '../lib/archimate4/SemanticType';

const fixturePath = path.join(__dirname, '..', 'resources', 'archimate4', 'relationships', 'archimate4_relationships_normalized.csv');
const fixtureRows = fs.readFileSync(fixturePath, 'utf8').trim().split(/\r?\n/).slice(1).map((line) => line.split(','));
const expected = new Set(fixtureRows.map((row) => `${row[1]}|${row[6]}|${row[4]}`));

describe('ArchiMate 4 relationship rules', () => {
  test('matches the supplied CSV for all 19,404 possible combinations', () => {
    expect(registry.concepts).toHaveLength(42);
    expect(registry.relationships).toHaveLength(11);
    let tested = 0;
    for (const source of registry.concepts) {
      for (const target of registry.concepts) {
        for (const relationship of registry.relationships) {
          expect(canConnect(source.id, relationship.id, target.id))
            .toBe(expected.has(`${source.displayName}|${relationship.id}|${target.displayName}`));
          tested++;
        }
      }
    }
    expect(tested).toBe(19404);
    expect(matrixStatus.ruleCount).toBe(3342);
  });

  test('provides readable expected relationships and denies absent combinations', () => {
    expect(canConnect('Resource', 'Assignment', 'Capability')).toBe(true);
    expect(canConnect('Resource', 'Composition', 'Capability')).toBe(false);
    expect(getAllowedRelationships('ApplicationComponent', 'DataObject'))
      .toEqual(expect.arrayContaining([ 'Assignment', 'Access', 'Association' ]));
    expect(getRelationshipCell('ApplicationComponent', 'DataObject').codes).toContain('I');
    expect(getRelationshipMatrix()).toMatchObject({ tripleCount: 3342 });
  });

  test('preserves directionality', () => {
    expect(canConnect('Resource', 'Assignment', 'Capability')).toBe(true);
    expect(canConnect('Capability', 'Assignment', 'Resource')).toBe(false);
  });

  test('resolves semantic node and relationship types instead of wrapper types', () => {
    expect(getSemanticType({ type: 'Resource', businessObject: { type: 'Element', elementRef: { type: 'Resource' } } })).toBe('Resource');
    expect(getSemanticType({ type: 'Relationship', businessObject: { type: 'Relationship', relationshipRef: { type: 'Assignment' } } })).toBe('Assignment');
  });

  test('normalizes relationship variants', () => {
    expect(ACCESS_MODES.map(normalizeAccessMode)).toEqual(ACCESS_MODES);
    expect(normalizeAccessMode('ReadWrite')).toBe('read-write');
    expect(normalizeAssociationMode(true)).toBe('directed');
    expect(normalizeAssociationMode()).toBe('undirected');
    expect(ASSOCIATION_MODES).toEqual([ 'undirected', 'directed' ]);
  });

  test.each([ 'AndJunction', 'OrJunction' ])('keeps %s chains homogeneous and matrix-valid', (type) => {
    expect(validateJunctionConnection({ type }, [ { type: 'Assignment' } ], {
      type: 'Assignment', sourceType: 'Resource', targetType: 'Capability'
    })).toBe(true);
    expect(validateJunctionConnection({ type }, [ { type: 'Flow' } ], {
      type: 'Assignment', sourceType: 'Resource', targetType: 'Capability'
    })).toBe(false);
  });

  test('uses the canonical matrix for imported relationships', () => {
    const invalid = validateModelRelationships({ relationshipsNode: { relationships: [
      { type: 'Assignment', source: { type: 'Resource' }, target: { type: 'Capability' } },
      { type: 'Composition', source: { type: 'Resource' }, target: { type: 'Capability' } }
    ] } });
    expect(invalid).toHaveLength(1);
    expect(invalid[0].relationship.type).toBe('Composition');
  });
});
