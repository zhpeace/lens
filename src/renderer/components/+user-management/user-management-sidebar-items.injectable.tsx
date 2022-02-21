/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import type { ISidebarItem } from "../layout/sidebar";
import { some } from "lodash/fp";

export const userManagementChildSidebarItemsInjectionToken = getInjectionToken<IComputedValue<ISidebarItem[]>>({
  id: "user-management-child-sidebar-items-injection-token",
});


const userManagementSidebarItemsInjectable = getInjectable({
  id: "user-management-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.injectMany(
      userManagementChildSidebarItemsInjectionToken,
    );

    return computed(() => {
      const parentId = "user-management";

      const childItems = childSidebarItems
        .flatMap((items) => items.get())
        .map((item) => ({ ...item, parentId }));

      return [
        {
          id: parentId,
          getIcon: () => <Icon material="security" />,
          title: "User Management",
          url: `asd`,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
        },

        ...childItems,
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default userManagementSidebarItemsInjectable;
