/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import workloadsOverviewRouteInjectable from "./workloads-overview-route.injectable";
import {
  workloadsChildSidebarItemsInjectionToken,
} from "../+workloads/workloads-sidebar-items.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";

const workloadsOverviewSidebarItemsInjectable = getInjectable({
  id: "workloads-overview-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(workloadsOverviewRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Overview",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: workloadsChildSidebarItemsInjectionToken,
});

export default workloadsOverviewSidebarItemsInjectable;
