/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { computed } from "mobx";
import { getInjectable } from "@ogre-tools/injectable";

import sidebarItemsInjectable from "../components/layout/sidebar-items.injectable";
import { matches } from "lodash/fp";
import type { SidebarItemProps } from "../components/layout/sidebar-item";

const siblingTabsInjectable = getInjectable({
  id: "sibling-tabs",

  instantiate: (di) => {
    const sidebarItems = di.inject(sidebarItemsInjectable);

    return computed((): SidebarItemProps[] => {
      const dereferencedSidebarItems = sidebarItems.get();

      const activeSidebarItem = dereferencedSidebarItems.find(
        matches({ isActive: true, parentId: null }),
      );

      if (!activeSidebarItem) {
        return [];
      }

      return dereferencedSidebarItems.filter(
        matches({ parentId: activeSidebarItem.id }),
      );
    });
  },
});

export default siblingTabsInjectable;
