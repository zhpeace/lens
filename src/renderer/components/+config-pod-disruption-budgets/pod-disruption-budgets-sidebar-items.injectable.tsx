/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import { getUrl } from "../../routes/get-url";
import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import podDisruptionBudgetsRouteInjectable from "./pod-disruption-budgets-route.injectable";
import { configChildSidebarItemsInjectionToken } from "../+config/config-sidebar-items.injectable";

const podDisruptionBudgetsSidebarItemsInjectable = getInjectable({
  id: "pod-disruption-budgets-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(podDisruptionBudgetsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        title: "Pod Disruption Budgets",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: configChildSidebarItemsInjectionToken,
});

export default podDisruptionBudgetsSidebarItemsInjectable;
