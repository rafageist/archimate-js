import registry from './Registry';
import { RELATIONSHIP_MATRIX_DATA, RELATIONSHIP_MATRIX_METADATA } from './generated/RelationshipMatrix.generated';

export const ACCESS_MODES = Object.freeze([ 'unspecified', 'read', 'write', 'read-write' ]);
export const ASSOCIATION_MODES = Object.freeze([ 'undirected', 'directed' ]);
const RELATIONSHIP_IDS = new Set(registry.relationships.map((item) => item.id));
const RELATIONSHIP_ORDER = [ 'Composition', 'Aggregation', 'Assignment', 'Realization', 'Serving', 'Access', 'Influence', 'Association', 'Specialization', 'Flow', 'Triggering' ];

function conceptName(type) {
  const concept = registry.getConcept(type);
  return concept ? concept.displayName : type;
}

function relationshipsFor(sourceType, targetType) {
  const targets = RELATIONSHIP_MATRIX_DATA[conceptName(sourceType)];
  return targets && targets[conceptName(targetType)] || [];
}

export function normalizeAccessMode(value) {
  if (value === undefined || value === null || value === '') return 'unspecified';
  const legacyModes = { Read: 'read', Write: 'write', ReadWrite: 'read-write' };
  if (legacyModes[value]) return legacyModes[value];
  return ACCESS_MODES.includes(value) ? value : 'unspecified';
}

export function normalizeAssociationMode(value) {
  return value === true || value === 'directed' ? 'directed' : 'undirected';
}

export function canConnect(sourceType, relationshipType, targetType) {
  if (!registry.getConcept(sourceType) || !registry.getConcept(targetType)) return false;
  if (!RELATIONSHIP_IDS.has(relationshipType)) return false;
  return relationshipsFor(sourceType, targetType).includes(relationshipType);
}

export function isRelationshipAllowed(sourceType, targetType, relationshipType) {
  return canConnect(sourceType, relationshipType, targetType);
}

export function getAllowedRelationships(sourceType, targetType, excludedRelationshipType) {
  return relationshipsFor(sourceType, targetType)
    .filter((relationshipType) => relationshipType !== excludedRelationshipType)
    .sort((left, right) => RELATIONSHIP_ORDER.indexOf(left) - RELATIONSHIP_ORDER.indexOf(right));
}

export const getRelationshipsAllowed = getAllowedRelationships;

export function getRelationshipCell(sourceType, targetType) {
  const relationships = getAllowedRelationships(sourceType, targetType);
  return Object.freeze({
    source: sourceType,
    target: targetType,
    relationships: Object.freeze([ ...relationships ]),
    codes: relationships.map((type) => RELATIONSHIP_MATRIX_METADATA.codes[type]).join('')
  });
}

export function getRelationshipMatrix() {
  return Object.freeze({
    concepts: RELATIONSHIP_MATRIX_METADATA.concepts,
    relationshipCodes: RELATIONSHIP_MATRIX_METADATA.codes,
    tripleCount: RELATIONSHIP_MATRIX_METADATA.tripleCount,
    getCell: getRelationshipCell
  });
}

export function validateJunctionConnection(junction, connectedRelationships, candidate) {
  if (!junction || ![ 'AndJunction', 'OrJunction' ].includes(junction.type)) return false;
  if (!candidate || !RELATIONSHIP_IDS.has(candidate.type)) return false;
  if (connectedRelationships.some((relationship) => relationship.type !== candidate.type)) return false;
  return canConnect(candidate.sourceType, candidate.type, candidate.targetType);
}

export function validateModelRelationships(model) {
  const relationships = model && model.relationshipsNode ? model.relationshipsNode.relationships || [] : [];
  return relationships.map((relationship) => ({
    relationship,
    valid: canConnect(
      relationship.source && relationship.source.type,
      relationship.type,
      relationship.target && relationship.target.type
    )
  })).filter((result) => !result.valid);
}

export const matrixStatus = Object.freeze({
  source: RELATIONSHIP_MATRIX_METADATA.source,
  normative: true,
  ruleCount: RELATIONSHIP_MATRIX_METADATA.tripleCount,
  defaultDecision: 'deny',
});
