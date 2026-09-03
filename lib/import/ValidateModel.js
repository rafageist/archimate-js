import registry from '../archimate4/Registry';

const RELATIONSHIP_TYPES = new Set(registry.relationships.map((item) => item.id));

function supportedConcept(type) {
  return Boolean(registry.getConcept(type) || registry.legacyMappings[type]);
}

export function validateImportModel(model) {
  const errors = [];
  const ids = new Set();

  function requireId(element, description) {
    if (!element || !element.id) {
      errors.push(`${description} has no id`);
      return;
    }
    if (ids.has(element.id)) errors.push(`Duplicate id: ${element.id}`);
    ids.add(element.id);
  }

  function validateNode(node, description) {
    requireId(node, description);
    if (node.type === 'Element') {
      if (!node.elementRef) errors.push(`${description} has an unresolved elementRef`);
      else if (!supportedConcept(node.elementRef.type)) {
        errors.push(`${description} references unsupported concept type: ${node.elementRef.type || 'unknown'}`);
      }
    } else if (node.type !== 'Note') {
      errors.push(`${description} has unsupported graphical type: ${node.type || 'unknown'}`);
    }
    (node.nodes || []).forEach((child, index) => validateNode(child, `${description} child ${index + 1}`));
  }

  if (!model || model.$type !== 'archimate:Model') {
    return [ 'The XML root must be an ArchiMate Model' ];
  }
  requireId(model, 'Model');

  const elements = model.elementsNode && model.elementsNode.baseElements || [];
  for (const element of elements) {
    requireId(element, 'Element');
    if (!supportedConcept(element.type)) errors.push(`Unsupported concept type: ${element.type || 'unknown'}`);
  }

  const relationships = model.relationshipsNode && model.relationshipsNode.relationships || [];
  for (const relationship of relationships) {
    requireId(relationship, 'Relationship');
    if (!RELATIONSHIP_TYPES.has(relationship.type)) {
      errors.push(`Unsupported relationship type: ${relationship.type || 'unknown'}`);
    }
    if (!relationship.source) errors.push(`Relationship ${relationship.id || '(without id)'} has an unresolved source`);
    if (!relationship.target) errors.push(`Relationship ${relationship.id || '(without id)'} has an unresolved target`);
  }

  const views = model.views && model.views.diagrams && model.views.diagrams.viewsList || [];
  if (!views.length) errors.push('The model must contain at least one diagram view');
  for (const view of views) {
    requireId(view, 'View');
    const connections = [];
    for (const viewElement of view.viewElements || []) {
      if (viewElement.$type === 'archimate:Connection') connections.push(viewElement);
      else validateNode(viewElement, `View element in ${view.id || '(view without id)'}`);
    }
    for (const connection of connections) {
      requireId(connection, `Connection in ${view.id}`);
      if (!connection.source) errors.push(`Connection ${connection.id || '(without id)'} has an unresolved source`);
      if (!connection.target) errors.push(`Connection ${connection.id || '(without id)'} has an unresolved target`);
      if (connection.type === 'Relationship' && !connection.relationshipRef) {
        errors.push(`Connection ${connection.id || '(without id)'} has an unresolved relationshipRef`);
      } else if (![ 'Relationship', 'Line' ].includes(connection.type)) {
        errors.push(`Connection ${connection.id || '(without id)'} has unsupported graphical type: ${connection.type || 'unknown'}`);
      }
      const waypoints = connection.waypointsNode && connection.waypointsNode.waypoints || [];
      if (waypoints.length < 2) errors.push(`Connection ${connection.id || '(without id)'} must have at least two waypoints`);
    }
  }

  return errors;
}

export function assertImportModelSupported(model) {
  const errors = validateImportModel(model);
  if (!errors.length) return;
  const error = new Error(`Unsupported ArchiMate XML:\n- ${errors.join('\n- ')}`);
  error.validationErrors = errors;
  throw error;
}
