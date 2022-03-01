/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import networkPoliciesRouteInjectable from "./network-policies-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { networkSidebarItemId } from "../+network/network-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const networkPoliciesSidebarItemsInjectable = getInjectable({
  id: "network-policies-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(networkPoliciesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "network-policies",
        parentId: networkSidebarItemId,
        title: "Network Policies",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive.get(),
        isVisible: route.isEnabled(),
        priority: 40,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default networkPoliciesSidebarItemsInjectable;
