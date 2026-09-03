import { ARCHIMATE_CONNECTION, ARCHIMATE_NODE } from '../metamodel/Concept';
import { is } from './ModelUtil';
import {
  getRelationshipsAllowed as getArchimate4RelationshipsAllowed,
  isRelationshipAllowed as isArchimate4RelationshipAllowed
} from '../archimate4/RelationshipRules';

export function getRelationshipsAllowed(sourceElementType, targetElementType, excludedRelationType) {
  return getArchimate4RelationshipsAllowed(
    sourceElementType,
    targetElementType,
    excludedRelationType
  );
}

/*
export function getReverseRelationshipsAllowed(sourceElementType, targetElementType) {
    var reverseRelationshipsAllowed = [];

    if (sourceElementType && targetElementType) {
        var sourceRelationshipMap = getRelationshipMap(targetElementType);
        var relationshipsAllowedString = sourceRelationshipMap.get(sourceElementType);
        if (relationshipsAllowedString) {
            var menuDef = null;
            for (const char of relationshipsAllowedString) {
                menuDef = eval('REVERSE_RELATIONSHIP_MENU_MAP.get('+char+')');
                menuDef.group.name = 'From ' + getTypeName(targetElementType) + ' to ' + getTypeName(sourceElementType);
                reverseRelationshipsAllowed.push(menuDef);
            }
        }
    }
    return reverseRelationshipsAllowed;
}
*/
  
export function isRelationshipAllowed(sourceType, targetType, relationshipType) {
  return isArchimate4RelationshipAllowed(sourceType, targetType, relationshipType);
}

export function getExistingRelationships(source, target, relationshipsNode, currentRelationshipRef) {

    function filterNode(array, sourceId, targetId, relationshipRefId) {
        //logger.log({sourceId, targetId, relationshipRefId});
        return array.filter((element) => {
            //logger.log(element);
            return Boolean(
              element &&
              element.source &&
              element.target &&
              element.source.id === sourceId &&
              element.target.id === targetId &&
              element.id !== relationshipRefId
            );
        }); 
    }

    var existingRelationships = [];
    var sourceRefId, targetRefId;

    if (is(source.businessObject, ARCHIMATE_NODE)) {
        sourceRefId = source.businessObject.elementRef.id;
    }
    if (is(source.businessObject, ARCHIMATE_CONNECTION)) {
        sourceRefId = source.businessObject.relationshipRef.id;
    }
    if (is(target.businessObject, ARCHIMATE_NODE)) {
        targetRefId = target.businessObject.elementRef.id;
    }
    if (is(target.businessObject, ARCHIMATE_CONNECTION)) {
        targetRefId = target.businessObject.relationshipRef.id;
    }

    if (relationshipsNode) {
        var relationships = relationshipsNode.relationships || [];
        existingRelationships = filterNode(relationships, sourceRefId, targetRefId, currentRelationshipRef);
    }

    return existingRelationships;



}


  
