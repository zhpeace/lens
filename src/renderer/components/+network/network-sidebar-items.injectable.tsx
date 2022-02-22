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
import networkChildSidebarItemsInjectable from "./network-child-sidebar-items.injectable";

const networkSidebarItemsInjectable = getInjectable({
  id: "network-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.inject(networkChildSidebarItemsInjectable);

    return computed(() => {
      const childItems = childSidebarItems.get();

      return [
        {
          getIcon: () => <Icon material="device_hub" />,
          title: "Network",
          onClick: noop,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
          children: childItems,
          priority: 50,
        },
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default networkSidebarItemsInjectable;
