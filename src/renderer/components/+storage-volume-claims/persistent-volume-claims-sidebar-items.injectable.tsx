/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import persistentVolumeClaimsRouteInjectable from "./persistent-volume-claims-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import { storageSidebarItemId } from "../+storage/storage-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const persistentVolumeClaimsSidebarItemsInjectable = getInjectable({
  id: "persistent-volume-claims-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(persistentVolumeClaimsRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "persistent-volume-claims",
        parentId: storageSidebarItemId,
        title: "Persistent Volume Claims",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive.get(),
        isVisible: route.isEnabled(),
        priority: 10,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default persistentVolumeClaimsSidebarItemsInjectable;
