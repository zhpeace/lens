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
import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";

const clusterOverviewSidebarItemsInjectable = getInjectable({
  id: "cluster-overview-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(clusterOverviewRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed((): ISidebarItem[] => [
      {
        title: "Overview",
        getIcon: () => <Icon svg="kube" />,
        onClick: () => navigateToRoute(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default clusterOverviewSidebarItemsInjectable;
