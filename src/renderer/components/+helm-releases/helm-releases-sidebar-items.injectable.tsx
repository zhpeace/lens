/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import helmReleasesRouteInjectable from "./helm-releases-route.injectable";
import { getUrl } from "../../routes/get-url";
import { helmChildSidebarItemsInjectionToken } from "../+helm/helm-sidebar-items.injectable";

const helmReleasesSidebarItemsInjectable = getInjectable({
  id: "helm-releases-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(helmReleasesRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        title: "Releases",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: helmChildSidebarItemsInjectionToken,
});

export default helmReleasesSidebarItemsInjectable;
