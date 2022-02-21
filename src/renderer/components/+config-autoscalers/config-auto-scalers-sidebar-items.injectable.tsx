/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "../layout/sidebar";

const configAutoScalersSidebarItemsInjectable = getInjectable({
  id: "config-auto-scalers-sidebar-items",

  instantiate: () =>
    computed((): ISidebarItem[] => [
      {
        id: "hpa",
        title: "HPA",
        parentId: "config",
        url: "https://google.com",
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default configAutoScalersSidebarItemsInjectable;
