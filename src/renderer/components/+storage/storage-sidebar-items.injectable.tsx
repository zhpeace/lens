/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import type { ISidebarItem } from "../layout/sidebar";
import { some } from "lodash/fp";

export const storageChildSidebarItemsInjectionToken = getInjectionToken<IComputedValue<ISidebarItem[]>>({
  id: "storage-child-sidebar-items-injection-token",
});

const storageSidebarItemsInjectable = getInjectable({
  id: "storage-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.injectMany(
      storageChildSidebarItemsInjectionToken,
    );

    return computed(() => {
      const parentId = "storage";

      const childItems = childSidebarItems
        .flatMap((items) => items.get())
        .map((item) => ({ ...item, parentId }));

      return [
        {
          id: parentId,
          getIcon: () => <Icon material="storage" />,
          title: "Storage",
          url: `asd`,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
        },

        ...childItems,
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default storageSidebarItemsInjectable;
