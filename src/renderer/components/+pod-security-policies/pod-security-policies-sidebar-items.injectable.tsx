/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import podSecurityPoliciesRouteInjectable from "./pod-security-policies-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import {
  userManagementChildSidebarItemsInjectionToken,
} from "../+user-management/user-management-child-sidebar-items.injectable";

const podSecurityPoliciesSidebarItemsInjectable = getInjectable({
  id: "pod-security-policies-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(podSecurityPoliciesRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Pod Security Policies",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 60,
      },
    ]);
  },

  injectionToken: userManagementChildSidebarItemsInjectionToken,
});

export default podSecurityPoliciesSidebarItemsInjectable;
