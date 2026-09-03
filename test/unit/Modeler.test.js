import Modeler from '../../lib/Modeler';

describe('Modeler', () => {
  let modeler;
  let container;

  beforeEach(() => {
    // 创建测试容器
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // 初始化 Modeler
    modeler = new Modeler({
      container: '#test-container',
      width: '100%',
      height: '100%'
    });
  });

  afterEach(() => {
    modeler.destroy();
    // 清理测试容器
    document.body.removeChild(container);
  });

  it('should create a new model', async () => {
    await expect(modeler.createNewModel()).resolves.toBeDefined();
  });

  it('should import XML', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <archimate:Model id="model-test" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:archimate="http://www.opengroup.org/xsd/archimate/3.0/" 
        xsi:schemaLocation="http://www.opengroup.org/xsd/archimate/3.0/ http://www.opengroup.org/xsd/archimate/3.1/archimate3_Diagram.xsd">
        <name>Test Model</name>
        <documentation></documentation>
        <archimate:Elements>
        </archimate:Elements>
        <archimate:Views>
          <archimate:Diagrams>
            <archimate:View id="view-test">
              <name>Test View</name>
              <documentation></documentation>
            </archimate:View>
          </archimate:Diagrams>
        </archimate:Views>
        <archimate:PropertyDefinitions>
        </archimate:PropertyDefinitions>
      </archimate:Model>`;

    await expect(modeler.importXML(xml)).resolves.toBeDefined();
  });

  it('should export XML', async () => {
    await modeler.createNewModel();
    const { xml } = await modeler.saveXML({ format: true });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<archimate:model');
  });

  it('should export an SVG preview', async () => {
    await modeler.createNewModel();
    const { svg } = await modeler.saveSVG();

    expect(svg).toContain('<svg');
  });
});
