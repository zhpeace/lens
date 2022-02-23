/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type React from "react";
import extensionRoutesInjectable from "./extension-routes.injectable";

export const routeInjectionToken = getInjectionToken<Route>({
  id: "route-injection-token",
});

export interface Route {
  path: string;
  Component: React.ElementType;
  clusterFrame: boolean;
  isEnabled: () => boolean;
  id?: string
}

const routesInjectable = getInjectable({
  id: "all-routes",

  instantiate: (di) => {
    const extensionRoutes = di.inject(extensionRoutesInjectable);
    const coreRoutes = di.injectMany(routeInjectionToken);

    return computed(() => [...coreRoutes, ...extensionRoutes.get()]);
  },
});

export default routesInjectable;
