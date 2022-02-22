/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { Icon } from "../icon";
import React from "react";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { computed, IComputedValue } from "mobx";
import type { ISidebarItem } from "../layout/sidebar";
import { noop, some } from "lodash/fp";
import { getSidebarItems } from "../layout/get-sidebar-items";

export const configChildSidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({
  id: "config-child-sidebar-items-injection-token",
});

const configSidebarItemsInjectable = getInjectable({
  id: "config-sidebar-items",

  instantiate: (di) => {
    const childRegistrations = di.injectMany(configChildSidebarItemsInjectionToken);
    const childSidebarItems = getSidebarItems(childRegistrations);

    return computed((): ISidebarItem[] => {
      const childItems = childSidebarItems.get();

      return [
        {
          title: "Config",
          getIcon: () => <Icon material="list" />,
          onClick: noop,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
          children: childItems,
          priority: 40,
        },
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default configSidebarItemsInjectable;
