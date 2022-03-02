/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import secretsRouteInjectable from "./secrets-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { configSidebarItemId } from "../+config/config-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const secretsSidebarItemsInjectable = getInjectable({
  id: "secrets-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(secretsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "secrets",
        parentId: configSidebarItemId,
        title: "Secrets",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default secretsSidebarItemsInjectable;
