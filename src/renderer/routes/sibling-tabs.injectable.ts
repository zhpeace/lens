/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { computed } from "mobx";
import { getInjectable } from "@ogre-tools/injectable";
import type { ISidebarItem } from "../components/layout/sidebar";

import sidebarItemsInjectable from "../components/layout/sidebar-items.injectable";
import { matches } from "lodash/fp";

const siblingTabsInjectable = getInjectable({
  id: "sibling-tabs",

  instantiate: (di) => {
    const sidebarItems = di.inject(sidebarItemsInjectable);

    return computed((): ISidebarItem[] => {
      const dereferencedSidebarItems = sidebarItems.get();

      const activeSidebarItem = dereferencedSidebarItems.find(
        matches({ isActive: true }),
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
