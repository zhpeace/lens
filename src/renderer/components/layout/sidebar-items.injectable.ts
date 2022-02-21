/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { matches } from "lodash/fp";
import { computed, IComputedValue } from "mobx";
import type { ISidebarItem } from "./sidebar";

export const sidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({ id: "sidebar-items-injection-token" });

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) =>
    computed((): ISidebarItem[] =>
      di
        .injectMany(sidebarItemsInjectionToken)
        .flatMap((x) => x.get())
        .filter(matches({ isVisible: true })),
    ),
});

export default sidebarItemsInjectable;
