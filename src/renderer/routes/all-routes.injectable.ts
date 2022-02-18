/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import type React from "react";

export const routeInjectionToken = getInjectionToken<Route>({
  id: "route-injection-token",
});

export const route2InjectionToken = getInjectionToken<IComputedValue<Route[]>>({
  id: "route2-injection-token",
});

export interface Route {
  title: string;
  path: string;
  Component: React.ElementType;
  clusterFrame: boolean;
  mikko: () => boolean;
  parent?: Route;
  getIcon?: () => React.ReactNode;
}

const routesInjectable = getInjectable({
  id: "all-routes",

  instantiate: (di) => {
    // const extensionRoutes = di.inject(extensionRoutesInjectable);
    const coreRoutes = di.injectMany(routeInjectionToken);
    const coreRoutes2 = di.injectMany(route2InjectionToken);

    // return computed(() => [...coreRoutes, ...extensionRoutes.get()]);
    return computed(() => {
      return [...coreRoutes, ...coreRoutes2.flatMap(x => x.get())];
    });
  },
});

export default routesInjectable;
