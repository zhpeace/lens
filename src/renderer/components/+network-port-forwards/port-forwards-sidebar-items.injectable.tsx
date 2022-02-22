/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import portForwardsRouteInjectable from "./port-forwards-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import {
  networkChildSidebarItemsInjectionToken,
} from "../+network/network-child-sidebar-items.injectable";

const portForwardsSidebarItemsInjectable = getInjectable({
  id: "port-forwards-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(portForwardsRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Port Forwarding",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 50,
      },
    ]);
  },

  injectionToken: networkChildSidebarItemsInjectionToken,
});

export default portForwardsSidebarItemsInjectable;
