/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import persistentVolumesRouteInjectable from "./persistent-volumes-route.injectable";
import { storageSidebarItemId } from "../+storage/storage-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const persistentVolumesSidebarItemsInjectable = getInjectable({
  id: "persistent-volumes-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(persistentVolumesRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const routeIsActive = di.inject(routeIsActiveInjectable, route);

    return computed(() => [
      {
        id: "persistent-volumes",
        parentId: storageSidebarItemId,
        title: "Persistent Volumes",
        onClick: () => navigateToRoute(route),
        isActive: routeIsActive.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default persistentVolumesSidebarItemsInjectable;
