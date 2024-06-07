import * as React from 'react';
import { observer } from 'mobx-react';
// import { NodeLabelProps } from '../../../components';
import { TaskNodeProps } from '../nodes/TaskNode';
import TaskPill, { TaskPillProps } from '../nodes/TaskPill';
import { useSize } from '../../../utils/useSize';
import { NodeLabelProps } from '../../../components';
import { RunStatus } from '../../types';
// import { useCombineRefs } from '../../../utils';

export type TaskGroupPillLabelProps = {
  shadowCount?: number;
  expandable?: boolean;
  status?: RunStatus;
} & Omit<TaskNodeProps, 'element'> &
  Omit<NodeLabelProps, 'status'> &
  NodeLabelProps &
  TaskPillProps;

// type PointWithSize = [number, number, number];

const TaskGroupPillLabel: React.FC<TaskGroupPillLabelProps> = ({
  element,
  // children,
  // className,
  // paddingX = 0,
  // paddingY = 0,
  // cornerRadius = 4,
  x = 0,
  y = 0,
  // position = LabelPosition.bottom,
  // centerLabelOnEdge,
  // secondaryLabel,
  // status,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  // badgeLocation = BadgeLocation.inner,
  // labelIconClass,
  // labelIcon,
  // labelIconPadding = 4,
  truncateLength,
  width,
  // dragRef,
  // hover,
  // dragging,
  // edgeDragging,
  // dropTarget,
  onContextMenu,
  contextMenuOpen,
  actionIcon,
  // actionIconClassName,
  onActionIconClick,
  // everything that's in node label pass here?
  ...rest
}) => {
  const taskRef = React.useRef();
  const pillRef = useSize();
  // const labelLocation = React.useRef<PointWithSize>();

  // const refs = useCombineRefs<SVGPathElement>(hoverRef, dragNodeRef);

  return (
    <TaskPill
      element={element}
      width={width}
      taskRef={taskRef}
      pillRef={pillRef as any}
      actionIcon={actionIcon}
      onActionIconClick={onActionIconClick}
      // className={styles.topologyGroupLabel}
      x={x}
      y={y}
      paddingX={8}
      paddingY={5}
      // secondaryLabel={secondaryLabel}
      truncateLength={truncateLength}
      badge={badge}
      badgeColor={badgeColor}
      badgeTextColor={badgeTextColor}
      badgeBorderColor={badgeBorderColor}
      badgeClassName={badgeClassName}
      // status={status as RunStatus}
      // badgeLocation={badgeLocation}
      // labelIconClass={labelIconClass}
      // labelIcon={labelIcon}
      // labelIconPadding={labelIconPadding}
      onContextMenu={onContextMenu}
      contextMenuOpen={contextMenuOpen}
      {...rest}
    />
  );
};

export default observer(TaskGroupPillLabel);
