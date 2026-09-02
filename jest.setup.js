global.IS_TEST = true;

if (!global.SVGElement.prototype.getBBox) {
  global.SVGElement.prototype.getBBox = function() {
    return { x: 0, y: 0, width: 100, height: 100 };
  };
}

if (!global.SVGElement.prototype.getCTM) {
  global.SVGElement.prototype.getCTM = function() {
    return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  };
}

Object.defineProperty(global.SVGElement.prototype, 'transform', {
  configurable: true,
  get() {
    return {
      baseVal: {
        clear() {},
        appendItem(item) { return item; },
        consolidate() { return null; }
      }
    };
  }
});

global.SVGMatrix = class SVGMatrix {
  constructor() {
    Object.assign(this, {
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
    });
  }
  multiply() { return this; }
  inverse() { return this; }
  translate() { return this; }
  scale() { return this; }
  rotate() { return this; }
};

global.SVGSVGElement.prototype.createSVGMatrix = function() {
  return new global.SVGMatrix();
};

global.SVGSVGElement.prototype.createSVGTransform = function() {
  return {
    setMatrix() {},
    setTranslate() {},
    setScale() {},
    setRotate() {}
  };
};
