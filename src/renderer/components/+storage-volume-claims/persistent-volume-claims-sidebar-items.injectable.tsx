/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import persistentVolumeClaimsRouteInjectable from "./persistent-volume-claims-route.injectable";
import { getUrl } from "../../routes/get-url";
import {
  storageChildSidebarItemsInjectionToken,
} from "../+storage/storage-sidebar-items.injectable";

const persistentVolumeClaimsSidebarItemsInjectable = getInjectable({
  id: "persistent-volume-claims-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(persistentVolumeClaimsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "persistent-volume-claims",
        title: "Persistent Volume Claims",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: storageChildSidebarItemsInjectionToken,
});

export default persistentVolumeClaimsSidebarItemsInjectable;
