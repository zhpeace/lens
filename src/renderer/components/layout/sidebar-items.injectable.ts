/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import type { ISidebarItem } from "./sidebar";
import routesInjectable from "../../routes/routes.injectable";
import { matches, some } from "lodash/fp";
import matchRouteInjectable from "../../routes/match-route.injectable";
import type { Route } from "../../routes/all-routes.injectable";

export const sidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({ id: "sidebar-items-injection-token" });

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    const routes = di.inject(routesInjectable);
    const matchRoute = di.inject(matchRouteInjectable);

    return computed((): ISidebarItem[] => {
      const mikkoRoutes = routes.get().filter((route) => route.mikko());

      const rootRoutes = mikkoRoutes.filter((item) => !item.parent);

      // TODO: .filter(x => x.children.length)

      const toSidebarItem = (rootRoute: Route): ISidebarItem => {
        const isChild = matches({ parent: rootRoute });

        const childSidebarItems = mikkoRoutes
          .filter(isChild)
          .map(toSidebarItem);

        const childIsActive = some(
          matches({ isActive: true }),
          childSidebarItems,
        );

        return {
          title: rootRoute.title,
          path: rootRoute.path,
          getIcon: rootRoute.getIcon,
          isActive: childIsActive || !!matchRoute({ path: rootRoute.path }),
          children: childSidebarItems,
        };
      };

      const routeSidebarItems = rootRoutes.map(toSidebarItem);

      const customSidebarItems = di.injectMany(sidebarItemsInjectionToken).flatMap(x => x.get());

      return [...routeSidebarItems, ...customSidebarItems];
    });
  },
});

export default sidebarItemsInjectable;
