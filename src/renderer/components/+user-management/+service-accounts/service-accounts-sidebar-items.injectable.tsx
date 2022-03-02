/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import serviceAccountsRouteInjectable from "./service-accounts-route.injectable";
import navigateToRouteInjectable from "../../../routes/navigate-to-route.injectable";
import { userManagementSidebarItemId } from "../user-management-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../../routes/route-is-active.injectable";

const serviceAccountsSidebarItemsInjectable = getInjectable({
  id: "service-accounts-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(serviceAccountsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "service-accounts",
        parentId: userManagementSidebarItemId,
        title: "Service Accounts",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default serviceAccountsSidebarItemsInjectable;
