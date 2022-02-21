/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import portForwardsRouteInjectable from "./port-forwards-route.injectable";
import { getUrl } from "../../routes/get-url";

const portForwardsSidebarItemsInjectable = getInjectable({
  id: "port-forwards-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(portForwardsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "port-forwards",
        parentId: "network",
        title: "Port Forwarding",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default portForwardsSidebarItemsInjectable;
