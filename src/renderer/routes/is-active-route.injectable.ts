/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Route } from "./all-routes.injectable";
import currentRouteInjectable from "./current-route.injectable";

const isActiveRouteInjectable = getInjectable({
  id: "is-active-route",

  instantiate: (di) => {
    const currentRoute = di.inject(currentRouteInjectable);

    return (route: Route) => route === currentRoute.get();
  },
});

export default isActiveRouteInjectable;
