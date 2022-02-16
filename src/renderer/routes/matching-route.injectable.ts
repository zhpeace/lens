/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import routesInjectable from "./routes.injectable";
import { matchPath } from "react-router";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { matches } from "lodash/fp";
import { computed } from "mobx";

const matchingRouteInjectable = getInjectable({
  id: "matching-route",

  instantiate: (di) => {
    const routes = di.inject(routesInjectable);
    const observableHistory = di.inject(observableHistoryInjectable);

    return computed(() => {
      const matchedRoutes = routes.get().map((route) => {
        const match = matchPath(observableHistory.location.pathname, route);

        return {
          route,
          isMatching: !!match,
          pathParameters: match ? match.params : {},
        };
      });

      const matchingRoute = matchedRoutes.find(matches({ isMatching: true }));

      console.log({ path: observableHistory.location.pathname, route: matchingRoute, routes: matchedRoutes });

      return matchingRoute;
    });
  },
});

export default matchingRouteInjectable;
