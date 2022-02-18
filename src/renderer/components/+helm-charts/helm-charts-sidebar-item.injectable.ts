/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { sidebarItemInjectionToken } from "../layout/sidebar-items.injectable";
import helmChartsRouteInjectable from "./helm-charts-route.injectable";

const helmChartsSidebarItemInjectable = getInjectable({
  id: "helm-charts-sidebar-item",

  instantiate: (di) => {
    const helmCharts = di.inject(helmChartsRouteInjectable);

    return {
      title: "Charts",
      path: helmCharts.path as string,
      children: [],
      isActive: false,
      route: di.inject(helmChartsRouteInjectable),
    };
  },

  injectionToken: sidebarItemInjectionToken,
});

export default helmChartsSidebarItemInjectable;
