/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "./sidebar";
import routesInjectable from "../../routes/routes.injectable";
import { matches } from "lodash/fp";
import matchRouteInjectable from "../../routes/match-route.injectable";

export const sidebarItemInjectionToken = getInjectionToken<ISidebarItem>({
  id: "sidebar-item-injection-token",
});

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    const routes = di.inject(routesInjectable);
    const matchRoute = di.inject(matchRouteInjectable);

    return computed((): ISidebarItem[] => {
      const mikkoRoutes = routes.get().filter((route) => route.mikko());

      const rootRoutes = mikkoRoutes.filter((item) => !item.parent);

      // TODO: .filter(x => x.children.length)

      return rootRoutes.map((rootRoute) => ({
        title: rootRoute.title,
        path: rootRoute.path,
        getIcon: rootRoute.getIcon,

        isActive: !!matchRoute({ path: rootRoute.path }),

        children: mikkoRoutes
          .filter(matches({ parent: rootRoute }))

          .map((childRoute) => ({
            title: childRoute.title,
            path: childRoute.path,
            getIcon: childRoute.getIcon,
            isActive: !!matchRoute({ path: childRoute.path }),
            children: [],
          })),
      }));
    });
  },
});

export default sidebarItemsInjectable;
