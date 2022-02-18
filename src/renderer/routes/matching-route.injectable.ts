/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import routesInjectable from "./routes.injectable";
import { matches, orderBy } from "lodash/fp";
import { computed } from "mobx";
import matchRouteInjectable from "./match-route.injectable";

const matchingRouteInjectable = getInjectable({
  id: "matching-route",

  instantiate: (di) => {
    const routes = di.inject(routesInjectable);
    const matchRoute = di.inject(matchRouteInjectable);

    return computed(() => {
      const matchedRoutes = routes.get().map((route) => {
        const match = matchRoute(route);

        return {
          route,
          isExactMatch: !!match && match.isExact,
          isMatching: !!match,
          pathParameters: match ? match.params : {},
        };
      });

      const asd = orderBy("isExact", "asc")(matchedRoutes);

      console.log(asd);

      return matchedRoutes.find(matches({ isMatching: true }));
    });
  },
});

export default matchingRouteInjectable;
