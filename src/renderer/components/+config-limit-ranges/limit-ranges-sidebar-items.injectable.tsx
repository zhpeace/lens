/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import limitRangesRouteInjectable from "./limit-ranges-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { configSidebarItemId } from "../+config/config-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const limitRangesSidebarItemsInjectable = getInjectable({
  id: "limit-ranges-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(limitRangesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => [
      {
        id: "limit-ranges",
        parentId: configSidebarItemId,
        title: "Limit Ranges",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 40,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default limitRangesSidebarItemsInjectable;
