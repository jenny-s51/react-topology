import * as React from 'react';
import { useSize } from '../../../utils';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import pipelineStyles from '../../../css/topology-pipelines';
import { pipeline } from "stream";


interface LabelActionIconProps {
  className?: string;
  icon: React.ReactElement;
  isIconExternal?: boolean;
  onClick: (e: React.MouseEvent) => void;
  iconOffsetX?: number;
  iconOffsetY?: number;
  x: number;
  y: number;
  height: number;
  paddingX: number;
  paddingY: number;
}

const LabelActionIcon = React.forwardRef<SVGRectElement, LabelActionIconProps>(
  ({ icon, isIconExternal, onClick, className, x, y, paddingX, height, iconOffsetX = 0, iconOffsetY = 0 }, actionRef) => {
    const [iconSize, iconRef] = useSize([icon, paddingX]);
    const iconWidth = iconSize?.width ?? 0;
    const iconHeight = iconSize?.height ?? 0;
    const iconY = (height - iconHeight) / 2;

    const classes = css(styles.topologyNodeActionIcon, className);

    const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
        e.stopPropagation();
        onClick(e);
      }
    };

    return (
      <g className={classes} onClick={handleClick}>
        {iconSize && (
          <rect
            ref={actionRef}
            className={isIconExternal ? css(pipelineStyles.topologyPipelinesNodeActionIconBackground) : css(styles.topologyNodeActionIconBackground)}
            x={x}
            y={y}
            width={iconWidth + paddingX * 2}
            height={height}
          />
        )}
        <g
          className={isIconExternal ? css(pipelineStyles.topologyPipelinesNodeActionIconIcon) : css(styles.topologyNodeActionIconIcon)}
          transform={`translate(${x + paddingX + iconOffsetX}, ${y + iconY + iconOffsetY})`}
          ref={iconRef}
        >
          {icon}
        </g>
      </g>
    );
  }
);

export default LabelActionIcon;
