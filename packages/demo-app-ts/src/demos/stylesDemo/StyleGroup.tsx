import * as React from 'react';
import {
  GraphElement,
  Node,
  observer,
  ScaleDetailsLevel,
  ShapeProps,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
  PipelinesDefaultGroup,
} from '@patternfly/react-topology';
import AlternateIcon from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import DefaultIcon from '@patternfly/react-icons/dist/esm/icons/builder-image-icon';

const ICON_PADDING = 20;

export enum DataTypes {
  Default,
  Alternate
}

type StyleGroupProps = {
  element: GraphElement;
  collapsible?: boolean;
  collapsedWidth?: number;
  collapsedHeight?: number;
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
  getCollapsedShape?: (node: Node) => React.FunctionComponent<ShapeProps>;
  collapsedShadowOffset?: number; // defaults to 10
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

const StyleGroup: React.FunctionComponent<StyleGroupProps> = ({
  element,
  collapsedWidth = 75,
  collapsedHeight = 60,
  ...rest
}) => {
  const groupElement = element as Node;
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel();

  const getTypeIcon = (dataType?: DataTypes): any => {
    switch (dataType) {
      case DataTypes.Alternate:
        return AlternateIcon;
      default:
        return DefaultIcon;
    }
  };

  const renderIcon = (): React.ReactNode => {
    const iconSize = Math.min(collapsedWidth, collapsedHeight) - ICON_PADDING * 2;
const label = element.getLabel();

    return (
      <g transform={`translate(${(collapsedWidth - iconSize) / 2}, ${(collapsedHeight - iconSize) / 2})`}>
        {label}
      </g>
    );
  };

  const passedData = React.useMemo(() => {
    const newData = { ...data };
    Object.keys(newData).forEach(key => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  return (
    <PipelinesDefaultGroup
      element={element}
      collapsible
      collapsedWidth={collapsedWidth}
      collapsedHeight={collapsedHeight}
      showLabel={detailsLevel === ScaleDetailsLevel.high}
      {...rest}
      {...passedData}
    >
      {groupElement.isCollapsed() ? renderIcon() : null}
    </PipelinesDefaultGroup>
  );
};

export default observer(StyleGroup);
