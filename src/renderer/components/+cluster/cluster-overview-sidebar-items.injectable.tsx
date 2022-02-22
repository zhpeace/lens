/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { Icon } from "../icon";
import React from "react";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "../layout/sidebar";
import clusterOverviewRouteInjectable from "./cluster-overview-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";

const clusterOverviewSidebarItemsInjectable = getInjectable({
  id: "cluster-overview-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(clusterOverviewRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed((): ISidebarItem[] => [
      {
        title: "Cluster",
        getIcon: () => <Icon svg="kube" />,
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default clusterOverviewSidebarItemsInjectable;
