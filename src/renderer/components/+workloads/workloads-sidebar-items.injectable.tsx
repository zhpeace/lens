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
import workloadsChildSidebarItemsInjectable from "./workloads-child-sidebar-items.injectable";

const workloadsSidebarItemsInjectable = getInjectable({
  id: "workloads-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.inject(workloadsChildSidebarItemsInjectable);

    return computed(() => {
      const childItems = childSidebarItems.get();

      return [
        {
          title: "Workloads",
          getIcon: () => <Icon svg="workloads" />,
          onClick: noop,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
          children: childItems,
          priority: 20,
        },
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default workloadsSidebarItemsInjectable;
