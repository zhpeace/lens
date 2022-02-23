/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import { noop, some } from "lodash/fp";
import { getSidebarItems } from "../layout/get-sidebar-items";
import type { ISidebarItem } from "../layout/sidebar";

export const userManagementChildSidebarItemsInjectionToken = getInjectionToken<IComputedValue<ISidebarItem[]>>({
  id: "user-management-child-sidebar-items-injection-token",
});

const userManagementSidebarItemsInjectable = getInjectable({
  id: "user-management-sidebar-items",

  instantiate: (di) => {
    const childRegistrations = di.injectMany(userManagementChildSidebarItemsInjectionToken);

    return computed(() => {
      const childItems = getSidebarItems(childRegistrations);

      return [
        {
          getIcon: () => <Icon material="security" />,
          title: "Access Control",
          onClick: noop,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
          children: childItems,
          priority: 100,
        },
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default userManagementSidebarItemsInjectable;
