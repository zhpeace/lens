/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import workloadsOverviewRouteInjectable from "./workloads-overview-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { workloadsSidebarItemId } from "../+workloads/workloads-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const workloadsOverviewSidebarItemsInjectable = getInjectable({
  id: "workloads-overview-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(workloadsOverviewRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "overview",
        parentId: workloadsSidebarItemId,
        title: "Overview",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default workloadsOverviewSidebarItemsInjectable;
