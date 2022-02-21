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

export const configChildSidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({
  id: "config-child-sidebar-items-injection-token",
});

const configSidebarItemsInjectable = getInjectable({
  id: "config-sidebar-items",

  instantiate: (di) => {
    const childSidebarItems = di.injectMany(
      configChildSidebarItemsInjectionToken,
    );

    return computed((): ISidebarItem[] => {
      const childItems = childSidebarItems.flatMap((items) => items.get());

      return [
        {
          title: "Config",
          getIcon: () => <Icon material="list" />,
          onClick: noop,
          isActive: some({ isActive: true }, childItems),
          isVisible: some({ isVisible: true }, childItems),
          children: childItems,
        },
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default configSidebarItemsInjectable;
