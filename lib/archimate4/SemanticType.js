import { CONNECTION_LINE, CONNECTION_RELATIONSHIP, NOTE, NODE_ELEMENT, VIEW } from '../util/ModelUtil';

export function getSemanticType(element) {
  if (!element) return undefined;
  if ([ NOTE, VIEW, CONNECTION_LINE ].includes(element.type)) return element.type;
  const businessObject = element.businessObject || element;
  if (businessObject.type === NODE_ELEMENT && businessObject.elementRef) return businessObject.elementRef.type;
  if (businessObject.type === CONNECTION_RELATIONSHIP && businessObject.relationshipRef) return businessObject.relationshipRef.type;
  if ([ 'AndJunction', 'OrJunction' ].includes(element.type)) return element.type;
  return element.type || businessObject.type;
}
