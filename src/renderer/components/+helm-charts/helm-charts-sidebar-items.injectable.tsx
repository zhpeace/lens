/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import helmChartsRouteInjectable from "./helm-charts-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { helmSidebarItemId } from "../+helm/helm-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const helmChartsSidebarItemsInjectable = getInjectable({
  id: "helm-charts-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(helmChartsRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        id: "charts",
        parentId: helmSidebarItemId,
        title: "Charts",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default helmChartsSidebarItemsInjectable;
