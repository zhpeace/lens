/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import catalogRouteInjectable from "./catalog-route.injectable";

const navigateToCatalogInjectable = getInjectable({
  id: "navigate-to-catalog",

  instantiate: (di) => {
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const catalogRoute = di.inject(catalogRouteInjectable);

    return ({ group, kind }: { group?: string, kind?: string } = {}) =>
      navigateToRoute(catalogRoute, {
        params: {
          group,
          kind,
        },
      });
  },
});

export default navigateToCatalogInjectable;
