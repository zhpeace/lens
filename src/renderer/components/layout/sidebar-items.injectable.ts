/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import type { IComputedValue } from "mobx";
import type { ISidebarItem } from "./sidebar";
import { getSidebarItems } from "./get-sidebar-items";
import extensionSidebarItemRegistrationsInjectable from "./extension-sidebar-item-registrations.injectable";

export const sidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({ id: "sidebar-items-injection-token" });

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    const sidebarItemRegistrations = di.injectMany(sidebarItemsInjectionToken);

    const extensionSidebarItemRegistrations = di.inject(extensionSidebarItemRegistrationsInjectable);

    return getSidebarItems([...sidebarItemRegistrations, extensionSidebarItemRegistrations]);
  },
});

export default sidebarItemsInjectable;
