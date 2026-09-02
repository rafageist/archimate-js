// 模拟浏览器环境
global.window = {
  document: {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      appendChild: () => {}
    })
  }
};

// 模拟 DOM 元素
global.HTMLElement = class {
  constructor() {
    this.style = {};
  }
  setAttribute() {}
  appendChild() {}
};

// 模拟 SVG 元素
global.SVGElement = class {
  constructor() {
    this.style = {};
  }
  setAttribute() {}
  appendChild() {}
};

// 模拟其他必要的全局对象
global.navigator = {
  userAgent: 'node'
}; 