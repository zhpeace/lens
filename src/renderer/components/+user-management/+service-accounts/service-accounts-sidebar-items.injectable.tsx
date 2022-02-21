/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../../layout/sidebar-items.injectable";

const serviceAccountsSidebarItemsInjectable = getInjectable({
  id: "service-accounts-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "service-accounts",
        parentId: "user-management",
        title: "Service Accounts",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default serviceAccountsSidebarItemsInjectable;
