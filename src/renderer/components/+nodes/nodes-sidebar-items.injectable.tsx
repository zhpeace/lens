/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

const nodesSidebarItemsInjectable = getInjectable({
  id: "nodes-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "nodes",
        getIcon: () => <Icon svg="nodes" />,
        title: "Nodes",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default nodesSidebarItemsInjectable;
