/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../../routes/has-access-to-route.injectable";
import serviceAccountsRouteInjectable from "./service-accounts-route.injectable";
import { getUrl } from "../../../routes/get-url";
import {
  userManagementChildSidebarItemsInjectionToken,
} from "../user-management-sidebar-items.injectable";

const serviceAccountsSidebarItemsInjectable = getInjectable({
  id: "service-accounts-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(serviceAccountsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "service-accounts",
        title: "Service Accounts",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: userManagementChildSidebarItemsInjectionToken,
});

export default serviceAccountsSidebarItemsInjectable;
