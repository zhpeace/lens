/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { getUrl } from "../../routes/get-url";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import storageClassesRouteInjectable from "./storage-classes-route.injectable";
import {
  storageChildSidebarItemsInjectionToken,
} from "../+storage/storage-sidebar-items.injectable";

const storageClassesSidebarItemsInjectable = getInjectable({
  id: "storage-classes-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(storageClassesRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        title: "Storage Classes",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: storageChildSidebarItemsInjectionToken,
});

export default storageClassesSidebarItemsInjectable;
