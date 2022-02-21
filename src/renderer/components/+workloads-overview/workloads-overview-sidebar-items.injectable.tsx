/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import workloadsOverviewRouteInjectable from "./workloads-overview-route.injectable";
import {
  workloadsChildSidebarItemsInjectionToken,
} from "../+workloads/workloads-sidebar-items.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";

const workloadsOverviewSidebarItemsInjectable = getInjectable({
  id: "workloads-overview-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(workloadsOverviewRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Overview",
        onClick: () => navigateToRoute(route),
        isActive: isActiveRoute(route),
        isVisible: route.mikko(),
      },
    ]);
  },

  injectionToken: workloadsChildSidebarItemsInjectionToken,
});

export default workloadsOverviewSidebarItemsInjectable;
