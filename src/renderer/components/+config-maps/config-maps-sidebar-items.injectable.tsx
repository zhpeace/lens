/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import configMapsRouteInjectable from "./config-maps-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { configSidebarItemId } from "../+config/config-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const configMapsSidebarItemsInjectable = getInjectable({
  id: "config-maps-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(configMapsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "config-maps",
        parentId: configSidebarItemId,
        title: "ConfigMaps",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default configMapsSidebarItemsInjectable;
