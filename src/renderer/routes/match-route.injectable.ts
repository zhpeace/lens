/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { matchPath } from "react-router";
import observableHistoryInjectable from "../navigation/observable-history.injectable";

const matchRouteInjectable = getInjectable({
  id: "match-route",

  instantiate: (di) => {
    const observableHistory = di.inject(observableHistoryInjectable);

    return (route: { path: string }) =>
      matchPath(observableHistory.location.pathname, route);
  },
});

export default matchRouteInjectable;
