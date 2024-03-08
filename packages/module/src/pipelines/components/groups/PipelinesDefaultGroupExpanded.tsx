import * as React from 'react';
import { observer } from 'mobx-react';
import { polygonHull } from 'd3-polygon';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import pipelineStyles from '../../../css/topology-pipelines';
import CollapseIcon from '@patternfly/react-icons/dist/esm/icons/compress-alt-icon';
import { CollapsibleGroupProps, Layer, PipelinesNodeLabel } from "../../../components";
import { WithDragNodeProps, WithSelectionProps, WithDndDropProps, WithContextMenuProps, useDragNode, useSvgAnchor } from "../../../behavior";
import { GROUPS_LAYER, TOP_LAYER } from "../../../const";
import { BadgeLocation, LabelPosition, isGraph, PointTuple, Node, NodeShape, NodeStyle } from "../../../types";
import { useHover, useCombineRefs, maxPadding, hullPath } from "../../../utils";
import Rect from '../../../geom/Rect';

type PipelinesDefaultGroupExpandedProps = {
  className?: string;
  element: Node;
  droppable?: boolean;
  canDrop?: boolean;
  dropTarget?: boolean;
  dragging?: boolean;
  hover?: boolean;
  label?: string; // Defaults to element.getLabel()
  secondaryLabel?: string;
  showLabel?: boolean; // Defaults to true
  truncateLength?: number; // Defaults to 13
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeClassName?: string;
  badgeLocation?: BadgeLocation;
  labelIconClass?: string; // Icon to show in label
  labelIcon?: string;
  labelPosition?: LabelPosition;
  labelIconPadding?: number;
  hulledOutline?: boolean;
} & CollapsibleGroupProps &
  WithDragNodeProps &
  WithSelectionProps &
  WithDndDropProps &
  WithContextMenuProps;

type PointWithSize = [number, number, number];

// Return the point whose Y is the largest or smallest based on the labelPosition value.
// If multiple points are found, compute the center X between them
// export for testing only
export function computeLabelLocation(points: PointWithSize[], labelPosition?: LabelPosition): PointWithSize {
  let lowPoints: PointWithSize[];
  let highPoints: PointWithSize[];
  const threshold = 5;

  if (labelPosition === LabelPosition.top) {
    points.forEach((p) => {
      const delta = !highPoints ? -Infinity : Math.round(p[1]) - Math.round(highPoints[0][1]);
      // If the difference is greater than the threshold, update the highest point
      if (delta < -threshold) {
        highPoints = [p];
      } else if (Math.abs(delta) <= threshold) {
        if (!highPoints) {
          highPoints = [];
        }
        highPoints.push(p);
      }
    });

    // find min and max by x and y coordinates
    const minX = highPoints.reduce((min, p) => Math.min(min, p[0]), Infinity);
    const maxX = highPoints.reduce((max, p) => Math.max(max, p[0]), -Infinity);
    const minY = highPoints.reduce((min, p) => Math.min(min, p[1]), Infinity);
    // find max by size value
    const maxSize = highPoints.reduce((max, p) => Math.max(max, p[2]), -Infinity);

    return [
      (minX + maxX) / 2,
      minY,
      // use the max size value
      maxSize
    ];
  }

  points.forEach(p => {
    const delta = !lowPoints ? Infinity : Math.round(p[1]) - Math.round(lowPoints[0][1]);
    if (delta > threshold) {
      lowPoints = [p];
    } else if (Math.abs(delta) <= threshold) {
      lowPoints.push(p);
    }
  });

  const minX = lowPoints.reduce((acc, point) => {
    return Math.min(acc, point[0]);
  }, Number.POSITIVE_INFINITY);
  const maxX = lowPoints.reduce((acc, point) => {
    return Math.max(acc, point[0]);
  }, Number.NEGATIVE_INFINITY);
  const maxSize = lowPoints.reduce((acc, point) => {
    return Math.max(acc, point[2]);
  }, Number.NEGATIVE_INFINITY);
  return [
    (minX + maxX) / 2,
    lowPoints[0][1],
    maxSize,
  ];
}

const PipelinesDefaultGroupExpanded: React.FunctionComponent<PipelinesDefaultGroupExpandedProps> = ({
  className,
  element,
  collapsible,
  selected,
  onSelect,
  hover,
  label,
  showLabel = true,
  truncateLength,
  dndDropRef,
  droppable,
  canDrop,
  dropTarget,
  dragging,
  dragNodeRef,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  badgeLocation,
  labelIconClass,
  labelIcon,
  labelPosition,
  labelIconPadding,
  onCollapseChange,
  hulledOutline = true,
}) => {
  const [hovered, hoverRef] = useHover();
  const [labelHover, labelHoverRef] = useHover();
  const dragLabelRef = useDragNode()[1];
  const refs = useCombineRefs<SVGPathElement>(hoverRef, dragNodeRef);
  const isHover = hover !== undefined ? hover : hovered;
  const anchorRef = useSvgAnchor();
  const outlineRef = useCombineRefs(dndDropRef, anchorRef);
  const labelLocation = React.useRef<PointWithSize>();
  const pathRef = React.useRef<string>();
  const boxRef = React.useRef<Rect | null>(null);

  let parent = element.getParent();
  let altGroup = false;
  while (!isGraph(parent)) {
    altGroup = !altGroup;
    parent = parent.getParent();
  }

  // cast to number and coerce
  const padding = maxPadding(element.getStyle<NodeStyle>().padding ?? 17);
  const extraPadding = labelPosition === LabelPosition.top ? 15 : 0; // add extra padding if label on top
  const hullPadding = (point: PointWithSize | PointTuple) => (point[2] || 0) + padding + extraPadding;

  if (!droppable || (hulledOutline && !pathRef.current) || (!hulledOutline && !boxRef.current) || !labelLocation.current) {
    const children = element.getNodes().filter(c => c.isVisible());
    if (children.length === 0) {
      return null;
    }
    const points: (PointWithSize | PointTuple)[] = [];
    children.forEach(c => {
      if (c.getNodeShape() === NodeShape.circle) {
        const bounds = c.getBounds();
        const { width, height } = bounds;
        const { x, y } = bounds.getCenter();
        const radius = Math.max(width, height) / 2;
        points.push([x, y, radius] as PointWithSize);
      } else {
        // add all 4 corners
        const { width, height, x, y } = c.getBounds();
        points.push([x, y, 0] as PointWithSize);
        points.push([x + width, y, 0] as PointWithSize);
        points.push([x, y + height, 0] as PointWithSize);
        points.push([x + width, y + height, 0] as PointWithSize);
      }
    });

    if (hulledOutline) {
      const hullPoints: (PointWithSize | PointTuple)[] =
        points.length > 2 ? polygonHull(points as PointTuple[]) : (points as PointTuple[]);
      if (!hullPoints) {
        return null;
      }

      // change the box only when not dragging
      pathRef.current = hullPath(hullPoints as PointTuple[], hullPadding);

      // Compute the location of the group label.
      labelLocation.current = computeLabelLocation(hullPoints as PointWithSize[], labelPosition);
    } else {
      boxRef.current = element.getBounds();
      labelLocation.current =
        labelPosition === LabelPosition.top
          ? [boxRef.current.x + boxRef.current.width / 2, boxRef.current.y, 0]
          : [boxRef.current.x + boxRef.current.width / 2, boxRef.current.y + boxRef.current.height, 0];
    }
  }

  const groupClassName = css(
    pipelineStyles.topologyPipelinesGroup,
    className,
    altGroup && 'pf-m-alt-group',
    canDrop && 'pf-m-highlight',
    dragging && 'pf-m-dragging',
    selected && 'pf-m-selected'
  );
  const innerGroupClassName = css(
    pipelineStyles.topologyPipelinesGroupInner,
    className,
    altGroup && 'pf-m-alt-group',
    canDrop && 'pf-m-highlight',
    dragging && 'pf-m-dragging',
    selected && 'pf-m-selected',
    (isHover || labelHover) && 'pf-m-hover',
    canDrop && dropTarget && 'pf-m-drop-target'
  );

  const outlinePadding = hulledOutline ? hullPadding(labelLocation.current) : 0;
  const labelGap = 24;
  const startX = labelLocation.current[0];
  const startY =
    labelPosition === LabelPosition.top
      ? labelLocation.current[1] - outlinePadding - 20
      : labelLocation.current[1] + outlinePadding + labelGap;

  return (
    <g ref={labelHoverRef} onClick={onSelect} className={groupClassName}>
      <Layer id={GROUPS_LAYER}>
        <g ref={refs} onClick={onSelect} className={innerGroupClassName}>
          {hulledOutline ? (
            <path ref={outlineRef} className={styles.topologyGroupBackground} d={pathRef.current} />
          ) : (
            <rect ref={outlineRef} className={styles.topologyGroupBackground} x={boxRef.current.x} y={boxRef.current.y} width={boxRef.current.width} height={boxRef.current.height}/>
          )}
        </g>
      </Layer>
      {showLabel && (label || element.getLabel()) && (
        <Layer id={isHover ? TOP_LAYER : undefined}>
          <PipelinesNodeLabel
            x={startX}
            y={startY}
            paddingX={8}
            paddingY={5}
            dragRef={dragNodeRef ? dragLabelRef : undefined}
            status={element.getNodeStatus()}
            truncateLength={truncateLength}
            badge={badge}
            badgeColor={badgeColor}
            badgeTextColor={badgeTextColor}
            badgeBorderColor={badgeBorderColor}
            badgeClassName={badgeClassName}
            badgeLocation={badgeLocation}
            labelIconClass={labelIconClass}
            labelIcon={labelIcon}
            labelIconPadding={labelIconPadding}
            hover={isHover || labelHover}
            isExpanded
            actionIcon={collapsible ? <CollapseIcon /> : undefined}
            onActionIconClick={() => onCollapseChange(element, true)}
          >
            {label || element.getLabel()}
          </PipelinesNodeLabel>
        </Layer>
      )}
    </g>
  );
};

export default observer(PipelinesDefaultGroupExpanded);
