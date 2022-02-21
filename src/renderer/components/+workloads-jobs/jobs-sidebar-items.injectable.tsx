/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import jobsRouteInjectable from "./jobs-route.injectable";
import { getUrl } from "../../routes/get-url";
import {
  workloadsChildSidebarItemsInjectionToken,
} from "../+workloads/workloads-sidebar-items.injectable";

const jobsSidebarItemsInjectable = getInjectable({
  id: "jobs-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(jobsRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        title: "Jobs",
        url: getUrl(route),
        isActive: isActiveRoute(route),
        isVisible: hasAccessToRoute(route),
      },
    ]);
  },

  injectionToken: workloadsChildSidebarItemsInjectionToken,
});

export default jobsSidebarItemsInjectable;
