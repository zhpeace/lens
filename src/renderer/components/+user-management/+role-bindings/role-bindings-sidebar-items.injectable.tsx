/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../../layout/sidebar-items.injectable";

const roleBindingsSidebarItemsInjectable = getInjectable({
  id: "role-bindings-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "role-bindings",
        parentId: "user-management",
        title: "Role Bindings",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default roleBindingsSidebarItemsInjectable;
