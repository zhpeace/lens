/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type React from "react";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";

export const routeInjectionToken = getInjectionToken<Route>({
  id: "route-injection-token",
});

export interface Route {
  path: string;
  Component: React.ElementType;
  clusterFrame: boolean;
  isEnabled: () => boolean;
  id?: string;
  exact?: boolean;
}

const routesInjectable = getInjectable({
  id: "all-routes",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed(() => {
      extensions.get();

      const asd = di.injectMany(routeInjectionToken);

      console.log("mikko", asd);

      return asd;
    });
  },
});

export default routesInjectable;
