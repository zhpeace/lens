/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import type { IComputedValue } from "mobx";
import { getSidebarItems } from "../layout/get-sidebar-items";
import type { ISidebarItem } from "../layout/sidebar";

export const helmChildSidebarItemsInjectionToken = getInjectionToken<IComputedValue<ISidebarItem[]>>({
  id: "helm-child-sidebar-items-injection-token",
});

const helmChildSidebarItemsInjectable = getInjectable({
  id: "helm-child-sidebar-items",

  instantiate: (di) => {
    const childRegistrations = di.injectMany(helmChildSidebarItemsInjectionToken);

    return getSidebarItems(childRegistrations);
  },
});

export default helmChildSidebarItemsInjectable;
