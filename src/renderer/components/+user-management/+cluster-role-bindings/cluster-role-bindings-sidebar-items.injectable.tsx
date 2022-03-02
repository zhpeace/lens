/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import clusterRoleBindingsRouteInjectable from "./cluster-role-bindings-route.injectable";
import navigateToRouteInjectable from "../../../routes/navigate-to-route.injectable";
import { userManagementSidebarItemId } from "../user-management-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../../routes/route-is-active.injectable";

const clusterRoleBindingsSidebarItemsInjectable = getInjectable({
  id: "cluster-role-bindings-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(clusterRoleBindingsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "cluster-role-bindings",
        parentId: userManagementSidebarItemId,
        title: "Cluster Role Bindings",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 40,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default clusterRoleBindingsSidebarItemsInjectable;
