/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import roleBindingsRouteInjectable from "./role-bindings-route.injectable";
import navigateToRouteInjectable from "../../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../../routes/current-route.injectable";
import { userManagementSidebarItemId } from "../user-management-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../../layout/sidebar-items.injectable";

const roleBindingsSidebarItemsInjectable = getInjectable({
  id: "role-bindings-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(roleBindingsRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        id: "role-bindings",
        parentId: userManagementSidebarItemId,
        title: "Role Bindings",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 50,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default roleBindingsSidebarItemsInjectable;
