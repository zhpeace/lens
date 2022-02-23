/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import { noop, some } from "lodash/fp";
import { getSidebarItems } from "../layout/get-sidebar-items";
import type { ISidebarItem } from "../layout/sidebar";

export const storageChildSidebarItemsInjectionToken = getInjectionToken<IComputedValue<ISidebarItem[]>>({
  id: "storage-child-sidebar-items-injection-token",
});

const storageSidebarItemsInjectable = getInjectable({
  id: "storage-sidebar-items",

  instantiate: (di) => {
    const childRegistrations = di.injectMany(storageChildSidebarItemsInjectionToken);

    return computed(() => {
      const childItems = getSidebarItems(childRegistrations).get();

      return [
        {
          getIcon: () => <Icon material="storage" />,
          title: "Storage",
          onClick: noop,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
          children: childItems,
          priority: 60,
        },
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default storageSidebarItemsInjectable;
