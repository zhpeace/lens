/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import podSecurityPoliciesRouteInjectable from "./pod-security-policies-route.injectable";
import { getUrl } from "../../routes/get-url";

const podSecurityPoliciesSidebarItemsInjectable = getInjectable({
  id: "pod-security-policies-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(podSecurityPoliciesRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "pod-security-policies",
        parentId: "user-management",
        title: "Pod Security Policies",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default podSecurityPoliciesSidebarItemsInjectable;
