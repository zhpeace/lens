/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import replicasetsRouteInjectable from "./replicasets-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { workloadsSidebarItemId } from "../+workloads/workloads-sidebar-items.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const replicasetsSidebarItemsInjectable = getInjectable({
  id: "replicasets-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(replicasetsRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);

    return computed(() => [
      {
        id: "replica-sets",
        parentId: workloadsSidebarItemId,
        title: "ReplicaSets",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 60,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default replicasetsSidebarItemsInjectable;
