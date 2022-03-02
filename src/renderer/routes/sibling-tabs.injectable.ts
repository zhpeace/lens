/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { computed } from "mobx";
import { getInjectable } from "@ogre-tools/injectable";

import sidebarItemsInjectable, {
  HierarchicalSidebarItem,
} from "../components/layout/sidebar-items.injectable";
import { matches } from "lodash/fp";

const siblingTabsInjectable = getInjectable({
  id: "sibling-tabs",

  instantiate: (di) => {
    const sidebarItems = di.inject(sidebarItemsInjectable);

    return computed((): HierarchicalSidebarItem[] => {
      const dereferencedSidebarItems = sidebarItems.get();

      const activeSidebarItem = dereferencedSidebarItems.find(
        (x) => x.isActive.get() && x.item.parentId === null,
      );

      if (!activeSidebarItem) {
        return [];
      }

      return dereferencedSidebarItems.filter(
        matches({ item: { parentId: activeSidebarItem.item.id }}),
      );
    });
  },
});

export default siblingTabsInjectable;
