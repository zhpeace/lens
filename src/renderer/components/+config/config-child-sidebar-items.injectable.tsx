/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import type { IComputedValue } from "mobx";
import type { ISidebarItem } from "../layout/sidebar";
import { getSidebarItems } from "../layout/get-sidebar-items";

export const configChildSidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({
  id: "config-child-sidebar-items-injection-token",
});

const configChildSidebarItemsInjectable = getInjectable({
  id: "config-child-sidebar-items",

  instantiate: (di) => {
    const childRegistrations = di.injectMany(configChildSidebarItemsInjectionToken);

    return getSidebarItems(childRegistrations);
  },
});

export default configChildSidebarItemsInjectable;
