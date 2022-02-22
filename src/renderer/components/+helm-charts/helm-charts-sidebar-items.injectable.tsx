/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import helmChartsRouteInjectable from "./helm-charts-route.injectable";
import { helmChildSidebarItemsInjectionToken } from "../+helm/helm-sidebar-items.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";

const helmChartsSidebarItemsInjectable = getInjectable({
  id: "helm-charts-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(helmChartsRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Charts",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: helmChildSidebarItemsInjectionToken,
});

export default helmChartsSidebarItemsInjectable;
