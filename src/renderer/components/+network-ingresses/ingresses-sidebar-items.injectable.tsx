/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import ingressesRouteInjectable from "./ingresses-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { networkSidebarItemId } from "../+network/network-sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const ingressesSidebarItemsInjectable = getInjectable({
  id: "ingresses-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(ingressesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "ingresses",
        parentId: networkSidebarItemId,
        title: "Ingresses",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 30,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default ingressesSidebarItemsInjectable;
