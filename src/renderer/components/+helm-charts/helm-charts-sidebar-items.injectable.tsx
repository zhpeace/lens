/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import { getUrl } from "../../routes/get-url";
import helmChartsRouteInjectable from "./helm-charts-route.injectable";
import { helmChildSidebarItemsInjectionToken } from "../+helm/helm-sidebar-items.injectable";

const helmChartsSidebarItemsInjectable = getInjectable({
  id: "helm-charts-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(helmChartsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "helm-charts",
        title: "Charts",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: helmChildSidebarItemsInjectionToken,
});

export default helmChartsSidebarItemsInjectable;
