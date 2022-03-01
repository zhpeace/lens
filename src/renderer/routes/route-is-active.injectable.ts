/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { Route } from "./all-routes.injectable";
import currentRouteInjectable from "./current-route.injectable";

const routeIsActiveInjectable = getInjectable({
  id: "route-is-active",

  instantiate: (di, route: Route) => {
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => currentRoute.get() === route);
  },

  lifecycle: lifecycleEnum.keyedSingleton({
    getInstanceKey: (di, route: Route) => {
      const path = route.path;

      console.log({ path });

      return path;
    },
  }),
});

export default routeIsActiveInjectable;
