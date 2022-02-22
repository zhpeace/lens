/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import { noop, some } from "lodash/fp";
import storageChildSidebarItemsInjectable from "./storage-child-sidebar-items.injectable";

const storageSidebarItemsInjectable = getInjectable({
  id: "storage-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.inject(storageChildSidebarItemsInjectable);

    return computed(() => {
      const childItems = childSidebarItems.get();

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
