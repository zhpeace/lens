/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import persistentVolumeClaimsRouteInjectable from "./persistent-volume-claims-route.injectable";
import { getUrl } from "../../routes/get-url";

const persistentVolumeClaimsSidebarItemsInjectable = getInjectable({
  id: "persistent-volume-claims-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(persistentVolumeClaimsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "persistent-volume-claims",
        parentId: "storage",
        title: "Persistent Volume Claims",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default persistentVolumeClaimsSidebarItemsInjectable;
