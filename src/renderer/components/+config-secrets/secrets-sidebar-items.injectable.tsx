/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import secretsRouteInjectable from "./secrets-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { configChildSidebarItemsInjectionToken } from "../+config/config-sidebar-items.injectable";

const secretsSidebarItemsInjectable = getInjectable({
  id: "secrets-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(secretsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => [
      {
        title: "Secrets",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: configChildSidebarItemsInjectionToken,
});

export default secretsSidebarItemsInjectable;
