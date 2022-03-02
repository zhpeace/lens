/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import helmChartsRouteInjectable from "./helm-charts-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { helmSidebarItemId } from "../+helm/helm-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const helmChartsSidebarItemsInjectable = getInjectable({
  id: "helm-charts-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(helmChartsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "charts",
        parentId: helmSidebarItemId,
        title: "Charts",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default helmChartsSidebarItemsInjectable;
