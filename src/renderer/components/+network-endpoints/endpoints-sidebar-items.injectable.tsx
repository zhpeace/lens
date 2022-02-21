/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import endpointsRouteInjectable from "./endpoints-route.injectable";
import { getUrl } from "../../routes/get-url";

const endpointsSidebarItemsInjectable = getInjectable({
  id: "endpoints-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(endpointsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "endpoints",
        parentId: "network",
        title: "Endpoints",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default endpointsSidebarItemsInjectable;
