import Modeler from '../lib/Modeler';

describe('ArchiMate 4 relationship modeling', () => {
  let modeler;

  beforeEach(async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    modeler = new Modeler({ container });
    await modeler.createNewModel();
  });

  afterEach(() => {
    const container = modeler.get('canvas').getContainer();
    modeler.destroy();
    container.remove();
  });

  async function roundTrip(sourceType, relationshipType, targetType) {
    const modeling = modeler.get('modeling');
    const factory = modeler.get('elementFactory');
    const root = modeler.get('canvas').getRootElement();
    const source = modeling.createShape(factory.createShape({ type: sourceType }), { x: 150, y: 150 }, root);
    const target = modeling.createShape(factory.createShape({ type: targetType }), { x: 400, y: 150 }, root);
    const connection = modeling.connect(source, target, { type: relationshipType });

    expect(connection.type).toBe(relationshipType);
    expect(connection.businessObject.relationshipRef.type).toBe(relationshipType);
    expect(modeler.get('elementRegistry').get(connection.id)).toBe(connection);

    const { xml } = await modeler.saveXML({ format: true });
    expect(xml).toContain(`type="${relationshipType}"`);
    await expect(modeler.importXML(xml)).resolves.toBeDefined();
    expect(modeler.get('elementRegistry').filter((element) => element.type === relationshipType)).toHaveLength(1);
  }

  test.each([
    [ 'Resource', 'Assignment', 'Capability' ],
    [ 'ApplicationComponent', 'Access', 'DataObject' ],
    [ 'Service', 'Serving', 'ApplicationComponent' ]
  ])('creates, renders, saves and imports %s -> %s -> %s', roundTrip);

  test('rejects a relationship absent from the matrix', () => {
    const modeling = modeler.get('modeling');
    const factory = modeler.get('elementFactory');
    const root = modeler.get('canvas').getRootElement();
    const source = modeling.createShape(factory.createShape({ type: 'Resource' }), { x: 150, y: 150 }, root);
    const target = modeling.createShape(factory.createShape({ type: 'Capability' }), { x: 400, y: 150 }, root);
    expect(() => modeling.connect(source, target, { type: 'Composition' })).toThrow(/not allowed/);
  });
});
