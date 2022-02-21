/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const ingressesSidebarItemsInjectable = getInjectable({
  id: "ingresses-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "ingresses",
        parentId: "network",
        title: "Ingresses",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default ingressesSidebarItemsInjectable;
