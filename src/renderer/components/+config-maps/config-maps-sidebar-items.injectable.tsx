/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import configMapsRouteInjectable from "./config-maps-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import {
  configChildSidebarItemsInjectionToken,
} from "../+config/config-child-sidebar-items.injectable";

const configMapsSidebarItemsInjectable = getInjectable({
  id: "config-maps-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(configMapsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => [
      {
        title: "ConfigMaps",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: configChildSidebarItemsInjectionToken,
});

export default configMapsSidebarItemsInjectable;
