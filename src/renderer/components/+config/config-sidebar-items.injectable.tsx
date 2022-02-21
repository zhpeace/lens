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
import clusterOverviewRouteInjectable from "../+cluster/cluster-overview-route.injectable";
import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";

const configSidebarItemsInjectable = getInjectable({
  id: "config-sidebar-items",

  instantiate: (di) => {
    // const route = di.inject(clusterOverviewRouteInjectable);
    const route = di.inject(clusterOverviewRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);


    return computed((): ISidebarItem[] => [
      {
        id: "config",
        title: "Config",
        getIcon: () => <Icon material="list" />,
        url: "https://google.com",
        isActive: false,
        isVisible: false,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default configSidebarItemsInjectable;
