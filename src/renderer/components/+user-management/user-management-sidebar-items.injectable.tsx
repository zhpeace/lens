/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import { noop, some } from "lodash/fp";
import userManagementChildSidebarItemsInjectable
  from "./user-management-child-sidebar-items.injectable";

const userManagementSidebarItemsInjectable = getInjectable({
  id: "user-management-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.inject(userManagementChildSidebarItemsInjectable);

    return computed(() => {
      const childItems = childSidebarItems.get();

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
