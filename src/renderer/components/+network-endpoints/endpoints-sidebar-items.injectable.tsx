/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import endpointsRouteInjectable from "./endpoints-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { networkSidebarItemId } from "../+network/network-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const endpointsSidebarItemsInjectable = getInjectable({
  id: "endpoints-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(endpointsRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        id: "endpoints",
        parentId: networkSidebarItemId,
        title: "Endpoints",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default endpointsSidebarItemsInjectable;
