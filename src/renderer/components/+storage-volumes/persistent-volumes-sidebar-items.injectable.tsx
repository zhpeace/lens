/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import persistentVolumesRouteInjectable from "./persistent-volumes-route.injectable";
import {
  storageChildSidebarItemsInjectionToken,
} from "../+storage/storage-sidebar-items.injectable";

const persistentVolumesSidebarItemsInjectable = getInjectable({
  id: "persistent-volumes-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(persistentVolumesRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        title: "Persistent Volumes",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 20,
      },
    ]);
  },

  injectionToken: storageChildSidebarItemsInjectionToken,
});

export default persistentVolumesSidebarItemsInjectable;
