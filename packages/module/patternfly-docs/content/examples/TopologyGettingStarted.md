---
id: About Topology
section: topology
sortValue: 1
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyGettingStartedDemo.tsx
propComponents: ['VisualizationProvider', 'VisualizationSurface']
---

import {
  ColaLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

**Note:** PatternFly's React Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

### React Topology

The React Topology package can be used to xyz. It contains xyz. This guide outlines the steps necessary to get started using React Topology.

#### Getting started

In order to use React Topology, you will first need to transform your back-end data into a [Model](https://github.com/patternfly/react-topology/blob/main/packages/module/src/types.ts#L16-L20) that contains the information needed to display nodes and edges within a topology view. Each node and edge has a set of properties used by Topology, as well as a data field that can be used to customize the nodes and edges by the application.

Follow these steps to set up your development environment for Topology:

1. Create a new controller via the default `Visualization` class.

  There are 3 `register` methods accessed by the controller. 
  
    The following 2 methods must be declared explicitly:

    - `registerLayoutFactory`: This method sets the layout of your topology view (for example, Force, Dagre, Cola, and so on). If your application supports all layouts, use `defaultLayoutFactory` as a parameter. If you only want to support a subset of the available layout options, update `defaultLayout` to a custom implementation.

    - `registerComponentFactory`: This method lets you customize the components in your topology view (e.g. nodes, groups, and edges). You can use `defaultComponentFactory` as a parameter.

  The remaining method is initialized in `Visualization.ts` and only needs to be declared if you support a custom implementation that modifies type attributes.

    - `registerElementFactory`: This method sets the types of the elements being used (such as graphs, nodes, or edges). `defaultElementFactory` uses types from `ModelKind` and is exported in `index.ts`.

1. Create nodes by calling the `fromModel` method on the controller. `fromModel` will take your data model as a parameter. Your data model should include a `graph` object, on which you will need to set `id` , `type`, and `layout`.

1. To create your topology view component, add a `<VisualizationProvider>`, which is a useful context provider. It allows access to the created controller and is required when using the `<VisualizationSurface>` component.

1. Use `<VisualizationSurface>` to provide the SVG component required for your topology components. `<VisualizationSurface>` can take a state parameter, which enables you to pass your state settings to the controller.

### Example

```ts file='./TopologyGettingStartedDemo.tsx'
```
