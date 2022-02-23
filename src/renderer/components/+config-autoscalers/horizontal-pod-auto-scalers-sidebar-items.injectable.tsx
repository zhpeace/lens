/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "../layout/sidebar";
import horizontalPodAutoscalersRouteInjectable from "./horizontal-pod-autoscalers-route.injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import { configChildSidebarItemsInjectionToken } from "../+config/config-sidebar-items.injectable";

const horizontalPodAutoScalersSidebarItemsInjectable = getInjectable({
  id: "horizontal-pod-auto-scalers-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(horizontalPodAutoscalersRouteInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed((): ISidebarItem[] => [
      {
        title: "HPA",
        onClick: () => navigateToRoute(route),
        isActive: route === currentRoute.get(),
        isVisible: route.isEnabled(),
        priority: 50,
      },
    ]);
  },

  injectionToken: configChildSidebarItemsInjectionToken,
});

export default horizontalPodAutoScalersSidebarItemsInjectable;
