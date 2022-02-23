/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import storageClassesRouteInjectable from "./storage-classes-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { storageSidebarItemId } from "../+storage/storage-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const storageClassesSidebarItemsInjectable = getInjectable({
  id: "storage-classes-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(storageClassesRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        id: "storage-classes",
        parentId: storageSidebarItemId,
        title: "Storage Classes",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 30,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default storageClassesSidebarItemsInjectable;
