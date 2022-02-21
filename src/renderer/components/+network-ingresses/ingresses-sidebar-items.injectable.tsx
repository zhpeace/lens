/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import { getUrl } from "../../routes/get-url";
import ingressesRouteInjectable from "./ingresses-route.injectable";
import {
  networkChildSidebarItemsInjectionToken,
} from "../+network/network-sidebar-items.injectable";

const ingressesSidebarItemsInjectable = getInjectable({
  id: "ingresses-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(ingressesRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        title: "Ingresses",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: networkChildSidebarItemsInjectionToken,
});

export default ingressesSidebarItemsInjectable;
