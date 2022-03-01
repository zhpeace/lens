/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import podSecurityPoliciesRouteInjectable from "./pod-security-policies-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { userManagementSidebarItemId } from "../+user-management/user-management-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const podSecurityPoliciesSidebarItemsInjectable = getInjectable({
  id: "pod-security-policies-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(podSecurityPoliciesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "pod-security-policies",
        parentId: userManagementSidebarItemId,
        title: "Pod Security Policies",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive.get(),
        isVisible: route.isEnabled(),
        priority: 60,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default podSecurityPoliciesSidebarItemsInjectable;
