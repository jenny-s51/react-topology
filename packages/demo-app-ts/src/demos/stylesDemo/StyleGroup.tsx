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
  collapsedWidth,
  collapsedHeight,
  ...rest
}) => {
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel();

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
    </PipelinesDefaultGroup>
  );
};

export default observer(StyleGroup);
