/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import clusterRolesRouteInjectable from "./cluster-roles-route.injectable";
import navigateToRouteInjectable from "../../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../../routes/current-route.injectable";
import {
  userManagementChildSidebarItemsInjectionToken,
} from "../user-management-child-sidebar-items.injectable";

const clusterRolesSidebarItemsInjectable = getInjectable({
  id: "cluster-roles-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(clusterRolesRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Cluster Roles",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: userManagementChildSidebarItemsInjectionToken,
});

export default clusterRolesSidebarItemsInjectable;
