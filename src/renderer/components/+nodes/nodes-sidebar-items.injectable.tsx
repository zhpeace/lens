/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import {
  SidebarItemRegistration,
  sidebarItemsInjectionToken,
} from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

import nodesRouteInjectable from "./nodes-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const nodesSidebarItemsInjectable = getInjectable({
  id: "nodes-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(nodesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed((): SidebarItemRegistration[] => [
      {
        id: "nodes",
        parentId: null,
        getIcon: () => <Icon svg="nodes" />,
        title: "Nodes",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default nodesSidebarItemsInjectable;
