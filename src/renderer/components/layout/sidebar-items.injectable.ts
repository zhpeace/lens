/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "./sidebar";
import routesInjectable from "../../routes/routes.injectable";
import { matches, some } from "lodash/fp";
import matchRouteInjectable from "../../routes/match-route.injectable";
import type { Route } from "../../routes/all-routes.injectable";

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

      return rootRoutes.map(toSidebarItem);
    });
  },
});

export default sidebarItemsInjectable;
