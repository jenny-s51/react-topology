---
id: Sidebar
section: topology
sortValue: 33
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologySidebarDemo.tsx
propComponents: ['TopologySideBar', 'TopologyView']
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
  NodeStatus,
  SELECTION_EVENT,
  TopologySideBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withSelection
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

**Note:** PatternFly's React Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

### Using a side bar

To add a sidebar, wrap your `VisualizationProvider` with the `TopologyView` component, which accepts `sideBar` as a prop.

Pass the `TopologySideBar` component to the `sideBar` prop. `TopologySideBar` should accept the following props:

- `show`: logic to show the sidebar, e.g. if a node is selected
- `onClose`: handle the user closing the window, e.g. unselect the current selection

### Example

```ts file='./TopologySidebarDemo.tsx'
```
