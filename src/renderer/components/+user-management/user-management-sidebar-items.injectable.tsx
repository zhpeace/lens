/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import { noop } from "lodash/fp";
import type { ISidebarItem } from "../layout/sidebar";

export const userManagementSidebarItemId = "user-management";

const userManagementSidebarItemsInjectable = getInjectable({
  id: "user-management-sidebar-items",

  instantiate: () =>
    computed((): ISidebarItem[] => [
      {
        id: userManagementSidebarItemId,
        parentId: null,
        getIcon: () => <Icon material="security" />,
        title: "Access Control",
        onClick: noop,
        priority: 100,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default userManagementSidebarItemsInjectable;
