/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { overSome } from "lodash/fp";
import { computed } from "mobx";
import type React from "react";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";

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
  extension?: LensRendererExtension;
}

const allRoutesInjectable = getInjectable({
  id: "all-routes",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed(() => {
      const enabledExtensions = extensions.get();

      return di
        .injectMany(routeInjectionToken)
        .filter((route) =>
          overSome([
            isNonExtensionRoute,
            isEnabledExtensionRouteFor(enabledExtensions),
          ])(route),
        );
    });
  },
});

const isNonExtensionRoute = (route: Route) => !route.extension;

const isEnabledExtensionRouteFor =
  (enabledExtensions: LensRendererExtension[]) => (route: Route) =>
    !!enabledExtensions.find((x) => x === route.extension);

export default allRoutesInjectable;
