import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-components';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';
import { WithDragNodeProps, WithSelectionProps, WithDndDropProps, WithContextMenuProps, useDragNode } from "../../../behavior";
import { CollapsibleGroupProps, Stadium, Layer, LabelBadge, PipelinesNodeLabel, NodeLabel } from "../../../components";
import { NODE_SHADOW_FILTER_ID_HOVER } from "../../../components/nodes/NodeShadows";
import { GROUPS_LAYER } from "../../../const";
import { LabelPosition, BadgeLocation, Node } from "../../../types";
import { useHover, useSize, useCombineRefs, createSvgIdUrl } from "../../../utils";

type PipelinesDefaultGroupCollapsedProps = {
  children?: React.ReactNode;
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
  labelPosition?: LabelPosition; // Defaults to bottom
  truncateLength?: number; // Defaults to 13
  labelIconClass?: string; // Icon to show in label
  labelIcon?: string;
  labelIconPadding?: number;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeClassName?: string;
  badgeLocation?: BadgeLocation;
} & CollapsibleGroupProps & WithDragNodeProps & WithSelectionProps & WithDndDropProps & WithContextMenuProps;

const PipelinesDefaultGroupCollapsed: React.FunctionComponent<PipelinesDefaultGroupCollapsedProps> = ({
  className,
  element,
  collapsible,
  selected,
  onSelect,
  children,
  hover,
  label,
  secondaryLabel,
  showLabel = true,
  truncateLength,
  collapsedWidth,
  collapsedHeight,
  getCollapsedShape,
  onCollapseChange,
  collapsedShadowOffset = 8,
  dndDropRef,
  dragNodeRef,
  canDrop,
  dropTarget,
  onContextMenu,
  contextMenuOpen,
  dragging,
  labelPosition,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  badgeLocation,
  labelIconClass,
  labelIcon,
  labelIconPadding
}) => {
  const [hovered, hoverRef] = useHover();
  const [labelHover, labelHoverRef] = useHover();
  const dragLabelRef = useDragNode()[1];
  const [shapeSize, shapeRef] = useSize([collapsedWidth, collapsedHeight]);
  const refs = useCombineRefs<SVGPathElement>(hoverRef, dragNodeRef, shapeRef);
  const isHover = hover !== undefined ? hover : hovered;

  const groupClassName = css(
    styles.topologyGroup,
    className,
    canDrop && 'pf-m-highlight',
    canDrop && dropTarget && 'pf-m-drop-target',
    dragging && 'pf-m-dragging',
    selected && 'pf-m-selected'
  );

  const filter = isHover || dragging || dropTarget ? createSvgIdUrl(NODE_SHADOW_FILTER_ID_HOVER) : undefined;

  return (
    <g ref={labelHoverRef} onContextMenu={onContextMenu} onClick={onSelect} className={groupClassName}>
      <Layer id={GROUPS_LAYER}>
        <g ref={refs} onClick={onSelect}>
            <>
              <g transform={`translate(${collapsedShadowOffset * 2}, 0)`}>
                <Stadium
                  className={css(styles.topologyNodeBackground, 'pf-m-disabled')}
                  element={element}
                  width={1}
                  height={1}
                />
              </g>
            </>
        </g>
      </Layer>
      {showLabel && (
        <PipelinesNodeLabel
          className={styles.topologyGroupLabel}
          x={collapsedWidth / 2}
          y={labelPosition === LabelPosition.top ? 0 : collapsedHeight + 6}
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
          actionIcon={collapsible ? <ExpandIcon /> : undefined}
          onActionIconClick={() => onCollapseChange(element, false)}
        >
          {label || element.getLabel()}
        </PipelinesNodeLabel>
      )}
      {children}
    </g>
  );
};

export default observer(PipelinesDefaultGroupCollapsed);
