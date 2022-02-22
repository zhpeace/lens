/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import React from "react";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";

import eventsRouteInjectable from "./events-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";

const eventsSidebarItemsInjectable = getInjectable({
  id: "events-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(eventsRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        getIcon: () => <Icon material="access_time" />,
        title: "Events",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 80,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default eventsSidebarItemsInjectable;
