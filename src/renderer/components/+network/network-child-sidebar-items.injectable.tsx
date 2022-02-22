/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import type { IComputedValue } from "mobx";
import type { ISidebarItem } from "../layout/sidebar";
import { getSidebarItems } from "../layout/get-sidebar-items";

export const networkChildSidebarItemsInjectionToken = getInjectionToken<IComputedValue<ISidebarItem[]>>({
  id: "network-child-sidebar-items-injection-token",
});

const networkChildSidebarItemsInjectable = getInjectable({
  id: "network-child-sidebar-items",

  instantiate: (di) => {
    const childRegistrations = di.injectMany(networkChildSidebarItemsInjectionToken);

    return getSidebarItems(childRegistrations);
  },
});

export default networkChildSidebarItemsInjectable;
