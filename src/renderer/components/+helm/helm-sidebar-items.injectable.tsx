/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import React from "react";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import type { ISidebarItem } from "../layout/sidebar";
import { some } from "lodash/fp";
import { noop } from "../../../common/utils";
import { getSidebarItems } from "../layout/get-sidebar-items";

export const helmChildSidebarItemsInjectionToken = getInjectionToken<IComputedValue<ISidebarItem[]>>({
  id: "helm-child-sidebar-items-injection-token",
});

const helmSidebarItemsInjectable = getInjectable({
  id: "helm-sidebar-items",

  instantiate: (di) => {
    const childRegistrations = di.injectMany(helmChildSidebarItemsInjectionToken);
    const childSidebarItems = getSidebarItems(childRegistrations);

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
