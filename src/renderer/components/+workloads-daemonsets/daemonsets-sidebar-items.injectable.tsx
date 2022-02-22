/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import daemonsetsRouteInjectable from "./daemonsets-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import {
  workloadsChildSidebarItemsInjectionToken,
} from "../+workloads/workloads-child-sidebar-items.injectable";

const daemonsetsSidebarItemsInjectable = getInjectable({
  id: "daemonsets-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(daemonsetsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => [
      {
        title: "DaemonSets",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 40,
      },
    ]);
  },

  injectionToken: workloadsChildSidebarItemsInjectionToken,
});

export default daemonsetsSidebarItemsInjectable;
