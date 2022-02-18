/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { SidebarItemAsd } from "./sidebar";
import routesInjectable from "../../routes/routes.injectable";
import { matches } from "lodash/fp";
import matchRouteInjectable from "../../routes/match-route.injectable";

export const sidebarItemInjectionToken = getInjectionToken<SidebarItemAsd>({ id: "sidebar-item-injection-token" });

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    const routes = di.inject(routesInjectable);

    const matchRoute = di.inject(matchRouteInjectable);
    // const allSidebarItems = di.injectMany(sidebarItemInjectionToken);

    return computed((): SidebarItemAsd[] => {
      // const tiinaRoutes = routes.get().filter(route => route.path === "/helm/charts/:repo?/:chartName?" || route.path === "/helm" || route.path === "/helm/releases/:repo?/:chartName?");

      const mikkoRoutes = routes.get().filter(route => route.mikko());

      const rootRoutes = mikkoRoutes.filter(item => !item.parent);

      return rootRoutes.map((rootRoute) => ({
        title: rootRoute.title,
        path: rootRoute.path,
        icon: rootRoute.icon,

        isActive: !!matchRoute({ path: rootRoute.path }),

        children: mikkoRoutes.filter(matches({ parent: rootRoute })).map(childRoute => ({
          title: childRoute.title,
          path: childRoute.path,
          icon: childRoute.icon,
          isActive: !!matchRoute({ path: childRoute.path }),
          children: [],
        })),
      })).filter(x => x.children.length);

      // console.log("mikkoasd", { janne, tiinaRoutes, mikkoRoutes });

      // return [
      //   {
      //     title: "Helm",
      //     path: "/helm/charts",
      //     icon: "apps",
      //
      //     isActive: some((x) => !!x)([
      //       matchRoute({ path: "/helm/charts" }),
      //       matchRoute({ path: "/helm/releases" }),
      //     ]),
      //
      //     children: [
      //       {
      //         title: "Charts",
      //         path: "/helm/charts",
      //         isActive: !!matchRoute({ path: "/helm/charts" }),
      //         children: [],
      //       },
      //       {
      //         title: "Releases",
      //         path: "/helm/releases",
      //         isActive: !!matchRoute({ path: "/helm/releases" }),
      //         children: [],
      //       },
      //     ],
      //   },
      //
      //   {
      //     title: "Users",
      //     path: "/service-accounts",
      //     icon: "security",
      //
      //     isActive: some((x) => !!x)([
      //       matchRoute({ path: "/service-accounts" }),
      //       matchRoute({ path: "/cluster-roles" }),
      //     ]),
      //
      //     children: [
      //       {
      //         title: "Service Accounts",
      //         path: "/service-accounts",
      //         isActive: !!matchRoute({ path: "/service-accounts" }),
      //         children: [],
      //       },
      //       {
      //         title: "Cluster Roles",
      //         path: "/cluster-roles",
      //         isActive: !!matchRoute({ path: "/cluster-roles" }),
      //         children: [],
      //       },
      //     ],
      //   },
      // ];
    });
  },
});

export default sidebarItemsInjectable;
