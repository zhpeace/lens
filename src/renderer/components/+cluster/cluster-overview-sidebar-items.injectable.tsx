/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { Icon } from "../icon";
import React from "react";
import {
  SidebarItemRegistration,
  sidebarItemsInjectionToken,
} from "../layout/sidebar-items.injectable";
import { computed } from "mobx";
import clusterOverviewRouteInjectable from "./cluster-overview-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const clusterOverviewSidebarItemsInjectable = getInjectable({
  id: "cluster-overview-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(clusterOverviewRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed((): SidebarItemRegistration[] => [
      {
        id: "cluster-overview",
        parentId: null,
        title: "Cluster",
        getIcon: () => <Icon svg="kube" />,
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive.get(),
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default clusterOverviewSidebarItemsInjectable;
