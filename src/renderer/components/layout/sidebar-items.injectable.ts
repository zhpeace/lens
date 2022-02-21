/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import type { ISidebarItem } from "./sidebar";

export const sidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({ id: "sidebar-items-injection-token" });

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    return computed((): ISidebarItem[] => {
      // const mikkoRoutes = routes.get().filter((route) => route.mikko());
      //
      // const rootRoutes = mikkoRoutes.filter((item) => !item.parent);
      //
      // // TODO: .filter(x => x.children.length)
      //
      // const toSidebarItem = (rootRoute: Route): ISidebarItem => {
      //   const isChild = matches({ parent: rootRoute });
      //
      //   const childSidebarItems = mikkoRoutes
      //     .filter(isChild)
      //     .map(toSidebarItem);
      //
      //   const childIsActive = some(
      //     matches({ isActive: true }),
      //     childSidebarItems,
      //   );
      //
      //   return {
      //     title: rootRoute.title,
      //     url: rootRoute.path, // TODO: TÄMÄ ON VÄÄRIN
      //     getIcon: rootRoute.getIcon,
      //     isActive: childIsActive || !!matchRoute({ path: rootRoute.path }),
      //     children: childSidebarItems,
      //   };
      // };
      //
      // const routeSidebarItems = rootRoutes.map(toSidebarItem);

      return di.injectMany(sidebarItemsInjectionToken).flatMap(x => x.get());
    });
  },
});

export default sidebarItemsInjectable;
