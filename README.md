# archimate-js

`archimate-js` 是一个基于 [diagram-js](https://github.com/bpmn-io/diagram-js) 建模引擎的 ArchiMate® 图表建模工具。它旨在提供一个功能丰富的平台，用于创建、修改、导入和导出符合 The Open Group ArchiMate® 标准的架构模型。

ArchiMate® 是 [The Open Group](https://www.opengroup.org/archimate-forum/archimate-overview) 的注册商标。

## 项目目标

*   提供直观的界面来创建和修改 ArchiMate® 模型和视图。
*   支持 ArchiMate® 模型以 XML 格式进行导入和导出，确保与其他工具的互操作性。
*   构建一个可扩展且易于集成的库，方便开发者将其嵌入到自己的应用中。

## 核心架构

`archimate-js` 的核心建立在 `diagram-js` 之上，其主要模块协同工作以提供完整的建模体验。

*   **`lib/Modeler.js`**:
    这是建模器的核心入口点，它集成了查看器和建模功能。`Modeler` 负责协调各种功能模块，例如元素的对齐、连接、创建、复制粘贴、标签编辑、调色板等。

*   **`lib/BaseModeler.js`**:
    作为 `Modeler` 的基础，`BaseModeler` 处理与 ArchiMate® 模型底层 XML 结构相关的核心功能。它负责 `moddle`（一个用于处理 XML 结构到 JavaScript 对象的库）实例的创建和管理，并追踪和验证模型中的元素 ID。

*   **`lib/Viewer.js`**:
    `Viewer` 模块负责图表的渲染和基本的交互功能。它继承自 `BaseViewer`，并包含图表选择、覆盖、键盘移动、画布移动、触摸和缩放滚动等功能，确保用户能够流畅地浏览和查看图表。

*   **`lib/features/`**:
    这个目录包含了建模器的各种具体功能模块，每个子目录通常代表一个独立的功能，例如：
    *   `palette/`: 提供用于创建新元素的工具面板。
    *   `context-pad/`: 提供在元素上右键点击时出现的上下文操作。
    *   `label-editing/`: 支持对图表元素进行文本编辑。
    *   `copy-paste/`: 实现图表元素的复制和粘贴功能。
    *   `modeling/`: 包含与 ArchiMate 元素和关系建模相关的核心逻辑。
    *   `rules/`: 定义了在建模过程中应用的业务规则，确保操作的合法性。

*   **`lib/moddle/` 和 `lib/metamodel/`**:
    这些目录用于处理 ArchiMate® 元模型。`moddle` 库负责将 XML 结构映射到 JavaScript 对象，而 `metamodel` 则定义了 ArchiMate® 模型的结构和类型。

## 功能特性

*   **创建/修改 ArchiMate® 模型和视图**:
    通过直观的拖放操作、上下文菜单和属性面板，用户可以轻松地创建、编辑和组织 ArchiMate® 元素和关系。支持对齐、连接、调整大小、复制粘贴等多种操作，以满足复杂的建模需求。

*   **导入/导出 ArchiMate® 模型 (XML 格式)**:
    支持将 ArchiMate® 模型导出为标准 XML 格式，方便模型在不同工具之间共享和迁移。同时，也支持导入现有的 ArchiMate® XML 文件，实现模型的复用。

## 如何使用 (概念性说明)

虽然具体的集成方法取决于您的应用环境，但通常情况下，您可以通过以下步骤概念性地使用 `archimate-js`：

1.  **引入 `Modeler`**:
    在您的 JavaScript 应用中引入 `Modeler` 类。

    ```javascript
    import Modeler from 'archimate-js/lib/Modeler';
    ```

2.  **初始化 Modeler**:
    创建一个 `Modeler` 实例，并将其挂载到您 HTML 页面中的一个容器元素上。

    ```javascript
    const archimateModeler = new Modeler({
      container: '#canvas', // 替换为您的容器 ID
      width: '100%',
      height: '100%'
    });
    ```

3.  **创建新模型或导入现有模型**:
    *   **创建新模型**:
        ```javascript
        archimateModeler.createNewModel();
        ```
    *   **导入现有 XML**:
        ```javascript
        const xml = '您的 ArchiMate XML 字符串';
        archimateModeler.importXML(xml, function(err) {
          if (err) {
            console.error('导入失败', err);
          } else {
            console.log('导入成功');
          }
        });
        ```

4.  **导出模型**:
    您可以将当前模型导出为 XML 字符串。

    ```javascript
    archimateModeler.saveXML({ format: true }, function(err, xml) {
      if (err) {
        console.error('导出失败', err);
      } else {
        console.log('导出的 XML:', xml);
      }
    });
    ```

## 项目结构概览

```
.
├── .yarn/                   # Yarn 4+ 相关目录
├── assets/                  # 静态资源，如 CSS、图标等
├── archimate-font/          # ArchiMate 图标字体及其源码
├── dist/                    # 构建输出目录
├── lib/                     # 核心源代码目录
│   ├── core/                # 核心模块
│   ├── draw/                # 绘图相关逻辑
│   ├── features/            # 功能模块（palette, context-pad, modeling, rules 等）
│   ├── import/              # 导入逻辑
│   ├── metamodel/           # ArchiMate 元模型定义
│   ├── moddle/              # moddle 相关配置
│   ├── util/                # 工具函数
│   ├── BaseModeler.js       # 建模器基础类
│   ├── BaseViewer.js        # 查看器基础类
│   ├── Modeler.js           # 核心建模器
│   ├── NavigatedViewer.js   # 导航查看器
│   └── Viewer.js            # 核心查看器
├── test/                    # 测试相关目录
│   ├── __mocks__/           # 测试 mock 文件
│   ├── setup.js             # 测试环境配置
│   └── unit/                # 单元测试
├── demo.html                # 项目演示入口页面
├── example.archimate        # 示例模型文件
├── index.js                 # 项目入口文件
├── package.json             # 项目依赖和脚本配置
├── vite.config.js           # Vite 配置文件
├── README.md                # 项目说明文档
├── CHANGELOG.md             # 变更日志
├── LICENSE                  # 许可证信息
└── ...                      # 其他配置文件
```


## 测试

项目使用 Jest 作为测试框架，并使用 Babel 进行代码转译。要运行测试，请按照以下步骤操作：

1. **安装依赖**
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true yarn install
   ```

2. **常用命令**

   - 启动开发模式：
     ```bash
     yarn start
     ```
   - 构建项目：
     ```bash
     yarn build
     ```
   - 预览构建结果：
     ```bash
     yarn preview
     ```
   - 运行测试：
     ```bash
     yarn test
     ```
   - 生成测试覆盖率报告：
     ```bash
     yarn test:coverage
     ```

3. **测试架构**
   - **Jest**: 作为主要的测试框架
     - 提供测试运行环境
     - 处理测试用例的执行
     - 生成测试报告和覆盖率报告
   - **Babel**: 作为代码转译工具
     - 通过 `babel-jest` 转译测试文件
     - 确保代码在不同环境中的兼容性
     - 支持现代 JavaScript 特性

4. **测试目录结构**
   ```
   test/
   ├── __mocks__/          # 模拟文件
   ├── setup.js            # 测试环境配置
   └── unit/               # 单元测试
       └── Modeler.test.js # Modeler 类的测试用例
   ```

5. **编写测试**
   - 所有测试文件都应该放在 `test/unit/` 目录下
   - 测试文件命名应该遵循 `*.test.js` 模式
   - 使用 Jest 的 `describe` 和 `it` 函数组织测试用例
   - 使用 `beforeEach` 和 `afterEach` 设置和清理测试环境

6. **测试覆盖率**
   - 运行 `yarn test:coverage` 生成覆盖率报告
   - 覆盖率报告将显示在 `coverage/` 目录下
   - 建议保持至少 80% 的测试覆盖率

7. **测试环境配置**
   - `jest.setup.js`: 设置全局测试环境变量和模拟浏览器环境
   - `babel.config.js`: 配置 Babel 转译选项
   - Jest 配置在 `package.json` 的 `jest` 字段中

## 优化建议

作为一个持续发展的项目，我们计划在以下方面进行改进和优化：

### 1. 技术架构改进

- **TypeScript 迁移**
  - 将项目迁移到 TypeScript
  - 提供更好的类型安全性和开发体验
  - 减少运行时错误，提高代码质量

- **模块化优化**
  - 使用 ES 模块系统重构代码
  - 优化模块间的依赖关系
  - 提高代码的可维护性和可测试性

### 2. 功能增强

- **协作功能**
  - 添加实时协作编辑功能
  - 支持多人同时编辑模型
  - 添加版本控制和变更追踪

- **高级建模功能**
  - 支持更多 ArchiMate 3.1 规范中的元素和关系
  - 添加模型验证功能
  - 支持模型分析和报告生成

- **集成能力**
  - 提供更多与其他工具的集成接口
  - 支持更多格式的导入导出
  - 添加 API 接口供第三方系统调用

### 3. 性能优化

- **渲染优化**
  - 实现虚拟化渲染，提高大型模型的性能
  - 优化 SVG 渲染性能
  - 添加模型分片加载功能

- **内存管理**
  - 优化大型模型的内存使用
  - 实现模型数据的懒加载
  - 添加内存使用监控

### 4. 用户体验提升

- **界面现代化**
  - 重新设计用户界面，使其更现代化
  - 添加深色模式支持
  - 优化移动设备支持

- **交互优化**
  - 添加快捷键支持
  - 优化拖拽操作体验
  - 添加更多可视化辅助工具

- **辅助功能**
  - 添加屏幕阅读器支持
  - 实现键盘导航
  - 支持高对比度模式

### 5. 开发体验改进

- **文档完善**
  - 编写详细的 API 文档
  - 添加更多使用示例
  - 提供最佳实践指南

- **测试增强**
  - 提高单元测试覆盖率
  - 添加端到端测试
  - 实现自动化测试流程

- **开发工具**
  - 添加开发调试工具
  - 提供性能分析工具
  - 实现开发环境配置工具

### 6. 安全性增强

- **数据安全**
  - 添加数据加密功能
  - 实现安全的模型存储
  - 添加访问控制机制

- **输入验证**
  - 加强用户输入验证
  - 防止 XSS 攻击
  - 实现 CSRF 保护

### 7. 部署和运维

- **容器化**
  - 提供 Docker 支持
  - 添加容器化部署文档
  - 优化容器性能

- **监控和日志**
  - 添加性能监控
  - 实现错误日志系统
  - 提供使用统计功能

### 8. 社区建设

- **贡献指南**
  - 编写详细的贡献指南
  - 建立代码审查流程
  - 提供问题模板

- **示例和教程**
  - 创建更多示例项目
  - 编写教程文档
  - 提供视频教程

### 9. 国际化支持

- **多语言支持**
  - 实现完整的国际化框架
  - 支持 RTL 布局
  - 添加语言包管理

### 10. 扩展性提升

- **插件系统**
  - 设计插件架构
  - 提供插件开发文档
  - 创建插件市场

- **主题系统**
  - 实现可定制的主题系统
  - 支持自定义样式
  - 提供主题模板

这些优化建议将根据项目需求和资源情况逐步实施。我们欢迎社区成员参与讨论和贡献，共同推动项目的发展。
