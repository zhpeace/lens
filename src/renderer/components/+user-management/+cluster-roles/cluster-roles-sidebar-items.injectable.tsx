/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import clusterRolesRouteInjectable from "./cluster-roles-route.injectable";
import navigateToRouteInjectable from "../../../routes/navigate-to-route.injectable";
import { userManagementSidebarItemId } from "../user-management-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../../routes/route-is-active.injectable";

const clusterRolesSidebarItemsInjectable = getInjectable({
  id: "cluster-roles-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(clusterRolesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "cluster-roles",
        parentId: userManagementSidebarItemId,
        title: "Cluster Roles",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default clusterRolesSidebarItemsInjectable;
