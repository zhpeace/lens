/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import daemonsetsRouteInjectable from "./daemonsets-route.injectable";
import { getUrl } from "../../routes/get-url";
import {
  workloadsChildSidebarItemsInjectionToken,
} from "../+workloads/workloads-sidebar-items.injectable";

const daemonsetsSidebarItemsInjectable = getInjectable({
  id: "daemonsets-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(daemonsetsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        title: "DaemonSets",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: workloadsChildSidebarItemsInjectionToken,
});

export default daemonsetsSidebarItemsInjectable;
