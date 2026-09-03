import { getExistingRelationships } from '../lib/util/RelationshipUtil';

describe('RelationshipUtil', () => {
  function node(id) {
    return {
      businessObject: {
        $type: 'archimate:Node',
        $instanceOf(type) { return type === 'archimate:Node'; },
        type: 'Element',
        elementRef: { id }
      }
    };
  }

  test('ignores incomplete relationship records while an element is dragged', () => {
    const source = node('source');
    const target = node('target');
    const relationshipsNode = {
      relationships: [
        { id: 'missing-ends' },
        { id: 'missing-target', source: { id: 'source' } },
        { id: 'valid', source: { id: 'source' }, target: { id: 'target' } }
      ]
    };

    expect(getExistingRelationships(source, target, relationshipsNode)).toEqual([
      relationshipsNode.relationships[2]
    ]);
  });
});
