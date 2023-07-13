import React from 'react';
import { Checkbox, ToolbarItem } from '@patternfly/react-core';

export const usePipelineOptions = (
  allowGroups = false
): {
  contextToolbar: React.ReactNode;
  showContextMenu: boolean;
  showBadges: boolean;
  showIcons: boolean;
  showGroups: boolean;
  badgeTooltips: boolean;
} => {
  const [showContextMenu, setShowContextMenu] = React.useState<boolean>(false);
  const [showBadges, setShowBadges] = React.useState<boolean>(false);
  const [showIcons, setShowIcons] = React.useState<boolean>(false);
  const [showGroups, setShowGroups] = React.useState<boolean>(false);
  const [badgeTooltips, setBadgeTooltips] = React.useState<boolean>(false);

  const contextToolbar = (
    <>
      <ToolbarItem>
        <Checkbox id="icons-switch" isChecked={showIcons} onChange={(_event, val) => setShowIcons(val)} label="Show icons" />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox id="badges-switch" isChecked={showBadges} onChange={(_event, val) => setShowBadges(val)} label="Show badges" />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox id="tooltips-switch" isChecked={badgeTooltips} onChange={(_event, val) => setBadgeTooltips(val)} label="Badge tooltips" />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox id="menus-switch" isChecked={showContextMenu} onChange={(_event, val) => setShowContextMenu(val)} label="Context menus" />
      </ToolbarItem>
      {allowGroups ? (
        <ToolbarItem>
          <Checkbox id="groups-switch" isChecked={showGroups} onChange={(_event, val) => setShowGroups(val)} label="Show groups" />
        </ToolbarItem>
      ) : null}
    </>
  );

  return { contextToolbar, showContextMenu, showBadges, showIcons, showGroups, badgeTooltips };
};
