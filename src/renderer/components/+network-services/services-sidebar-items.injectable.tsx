/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const servicesSidebarItemsInjectable = getInjectable({
  id: "services-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "services",
        parentId: "network",
        title: "Services",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default servicesSidebarItemsInjectable;
