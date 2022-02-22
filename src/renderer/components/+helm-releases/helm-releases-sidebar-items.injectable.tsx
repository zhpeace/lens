/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import helmReleasesRouteInjectable from "./helm-releases-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { helmChildSidebarItemsInjectionToken } from "../+helm/helm-child-sidebar-items.injectable";

const helmReleasesSidebarItemsInjectable = getInjectable({
  id: "helm-releases-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(helmReleasesRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Releases",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: helmChildSidebarItemsInjectionToken,
});

export default helmReleasesSidebarItemsInjectable;
