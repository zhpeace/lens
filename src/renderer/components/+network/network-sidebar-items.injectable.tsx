/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

const networkSidebarItemsInjectable = getInjectable({
  id: "network-sidebar-items",

  instantiate: () => {
    return computed(() => [
      {
        id: "network",
        getIcon: () => <Icon material="device_hub" />,
        title: "Network",
        url: `asd`,
        isActive: false,
        isVisible: true,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default networkSidebarItemsInjectable;
