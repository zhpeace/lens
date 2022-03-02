/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import statefulsetsRouteInjectable from "./statefulsets-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { workloadsSidebarItemId } from "../+workloads/workloads-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const statefulsetsSidebarItemsInjectable = getInjectable({
  id: "statefulsets-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(statefulsetsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "stateful-sets",
        parentId: workloadsSidebarItemId,
        title: "StatefulSets",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 50,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default statefulsetsSidebarItemsInjectable;
