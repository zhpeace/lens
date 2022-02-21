/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import { getUrl } from "../../routes/get-url";
import limitRangesRouteInjectable from "./limit-ranges-route.injectable";
import { configChildSidebarItemsInjectionToken } from "../+config/config-sidebar-items.injectable";

const limitRangesSidebarItemsInjectable = getInjectable({
  id: "limit-ranges-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(limitRangesRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        title: "Limit Ranges",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: configChildSidebarItemsInjectionToken,
});

export default limitRangesSidebarItemsInjectable;
