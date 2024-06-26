import { Graph, GRAPH_LAYOUT_END_EVENT, Layout } from '../types';
import { getGroupPadding } from '../utils/element-utils';
import { ForceSimulationNode } from './ForceSimulation';
import { BaseLayout } from '.';
import { LayoutLink } from './LayoutLink';
import { LayoutOptions } from './LayoutOptions';

export class ForceLayout extends BaseLayout implements Layout {
  constructor(graph: Graph, options?: Partial<LayoutOptions>) {
    super(graph, {
      ...options,
      layoutOnDrag: true,
      onSimulationEnd: () => {
        this.nodes.forEach((n) => n.setFixed(false));
        this.graph.getController().fireEvent(GRAPH_LAYOUT_END_EVENT, { graph: this.graph });
      }
    });
  }

  protected getLinkDistance = (e: LayoutLink | d3.SimulationLinkDatum<ForceSimulationNode>) => {
    let distance = this.options.linkDistance + e.source.radius + e.target.radius;
    const isFalse = e instanceof LayoutLink && e.isFalse;
    if (!isFalse && e.source.element.getParent() !== e.target.element.getParent()) {
      // find the group padding
      distance += getGroupPadding(e.source.element.getParent());
      distance += getGroupPadding(e.target.element.getParent());
    }

    return distance;
  };

  protected startLayout(graph: Graph): void {
    const { width, height } = graph.getBounds();
    const cx = width / 2;
    const cy = height / 2;
    this.forceSimulation.forceCenter(cx, cy);
    this.forceSimulation.alpha(1);
    this.forceSimulation.useForceSimulation(this.nodes, this.edges, this.getLinkDistance);
    this.forceSimulation.restart();
  }

  protected updateLayout(): void {
    this.forceSimulation.useForceSimulation(this.nodes, this.edges, this.getFixedNodeDistance);
    this.forceSimulation.alpha(0.2);
    this.forceSimulation.restart();
  }
}
