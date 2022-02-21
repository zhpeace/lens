/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import horizontalPodAutoscalersRouteInjectable
  from "../+config-autoscalers/horizontal-pod-autoscalers-route.injectable";
import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";

const userManagementSidebarItemsInjectable = getInjectable({
  id: "user-management-sidebar-items",

  instantiate: (di) => {
    const route = di.inject(horizontalPodAutoscalersRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    return computed(() => [
      {
        id: "user-management",
        getIcon: () => <Icon material="security" />,
        title: "User Management",
        url: `asd`,
        isActive: false,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default userManagementSidebarItemsInjectable;
