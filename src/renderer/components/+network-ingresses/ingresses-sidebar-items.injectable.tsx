/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import ingressesRouteInjectable from "./ingresses-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { networkSidebarItemId } from "../+network/network-sidebar-items.injectable";

const ingressesSidebarItemsInjectable = getInjectable({
  id: "ingresses-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(ingressesRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        id: "ingresses",
        parentId: networkSidebarItemId,
        title: "Ingresses",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 30,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default ingressesSidebarItemsInjectable;
