/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import resourceQuotasRouteInjectable from "./resource-quotas-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { configSidebarItemId } from "../+config/config-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const resourceQuotasSidebarItemsInjectable = getInjectable({
  id: "resource-quotas-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(resourceQuotasRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => [
      {
        id: "resource-quotas",
        parentId: configSidebarItemId,
        title: "Resource Quotas",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 30,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default resourceQuotasSidebarItemsInjectable;
