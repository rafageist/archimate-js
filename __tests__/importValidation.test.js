import Modeler from '../lib/Modeler';

describe('strict transactional XML import', () => {
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

  test('rejects unsupported concepts without replacing the open model', async () => {
    const modeling = modeler.get('modeling');
    const factory = modeler.get('elementFactory');
    const root = modeler.get('canvas').getRootElement();
    modeling.createShape(factory.createShape({ type: 'Capability' }), { x: 200, y: 150 }, root);
    const before = (await modeler.saveXML({ format: true })).xml;
    const unsupported = before.replace('type="Capability"', 'type="UnknownModelioConcept"');

    await expect(modeler.importXML(unsupported)).rejects.toThrow(/Unsupported concept type: UnknownModelioConcept/);

    const after = (await modeler.saveXML({ format: true })).xml;
    expect(after).toBe(before);
    expect(modeler.get('elementRegistry').filter((element) => element.type === 'Capability')).toHaveLength(1);
  });

  test('rejects dangling relationship references', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <archimate:Model id="model-invalid" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:archimate="http://www.opengroup.org/xsd/archimate/3.0/">
        <archimate:name>Invalid import</archimate:name>
        <archimate:elements><archimate:element id="source" xsi:type="archimate:Resource" /></archimate:elements>
        <archimate:relationships><archimate:relationship id="broken" source="source" xsi:type="archimate:Assignment" /></archimate:relationships>
        <archimate:views><archimate:diagrams><archimate:view id="view-invalid" /></archimate:diagrams></archimate:views>
      </archimate:Model>`;

    await expect(modeler.importXML(xml)).rejects.toThrow(/unresolved target/);
    expect(modeler.get('canvas').getRootElement()).toBeDefined();
  });

  test('rolls back when rendering fails after accepting a parsed model', async () => {
    const previousModel = modeler.getModel();
    const previousElementsById = modeler.getElementsById();
    const openView = modeler.openView.bind(modeler);
    let attempts = 0;
    modeler.openView = (...args) => {
      attempts++;
      return attempts === 1 ? Promise.reject(new Error('synthetic render failure')) : openView(...args);
    };

    await expect(modeler.importModel({ id: 'replacement' }, undefined, {}))
      .rejects.toThrow('synthetic render failure');

    expect(modeler.getModel()).toBe(previousModel);
    expect(modeler.getElementsById()).toBe(previousElementsById);
    expect(modeler.get('canvas').getRootElement().modelRef).toBe(previousModel);
  });
});
