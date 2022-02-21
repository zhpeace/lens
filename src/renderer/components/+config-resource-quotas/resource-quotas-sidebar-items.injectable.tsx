/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import resourceQuotasRouteInjectable from "./resource-quotas-route.injectable";
import { configChildSidebarItemsInjectionToken } from "../+config/config-sidebar-items.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";

const resourceQuotasSidebarItemsInjectable = getInjectable({
  id: "resource-quotas-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(resourceQuotasRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => [
      {
        title: "Resource Quotas",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.mikko(),
      },
    ]);
  },

  injectionToken: configChildSidebarItemsInjectionToken,
});

export default resourceQuotasSidebarItemsInjectable;
