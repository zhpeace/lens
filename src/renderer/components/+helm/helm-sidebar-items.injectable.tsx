/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import React from "react";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import { some } from "lodash/fp";
import { noop } from "../../../common/utils";
import helmChildSidebarItemsInjectable from "./helm-child-sidebar-items.injectable";

const helmSidebarItemsInjectable = getInjectable({
  id: "helm-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.inject(helmChildSidebarItemsInjectable);

    return computed(() => {
      const childItems = childSidebarItems.get();

      return [
        {
          getIcon: () => <Icon material="apps" />,
          title: "Helm",
          onClick: noop,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
          children: childItems,
          priority: 90,
        },
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default helmSidebarItemsInjectable;
