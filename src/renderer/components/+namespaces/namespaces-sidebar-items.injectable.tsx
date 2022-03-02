/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import {
  SidebarItemRegistration,
  sidebarItemsInjectionToken,
} from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

import namespacesRouteInjectable from "./namespaces-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const namespacesSidebarItemsInjectable = getInjectable({
  id: "namespaces",

  instantiate: (di) => {
    const route = di.inject(namespacesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed((): SidebarItemRegistration[] => [
      {
        id: "namespaces",
        parentId: null,
        getIcon: () => <Icon material="layers" />,
        title: "Namespaces",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive,
        isVisible: route.isEnabled(),
        priority: 70,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default namespacesSidebarItemsInjectable;
