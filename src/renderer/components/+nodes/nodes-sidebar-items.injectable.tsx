/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

import nodesRouteInjectable from "./nodes-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import type { ISidebarItem } from "../layout/sidebar";

const nodesSidebarItemsInjectable = getInjectable({
  id: "nodes-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(nodesRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed((): ISidebarItem[] => [
      {
        id: "nodes",
        parentId: null,
        getIcon: () => <Icon svg="nodes" />,
        title: "Nodes",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default nodesSidebarItemsInjectable;
