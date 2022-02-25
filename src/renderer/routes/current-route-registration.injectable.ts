/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { matchPath } from "react-router";
import routeRegistrationsInjectable from "./route-registrations.injectable";

const currentRouteRegistrationInjectable = getInjectable({
  id: "current-route-registration",

  instantiate: (di) => {
    const routeRegistrations = di.inject(routeRegistrationsInjectable);
    const observableHistory = di.inject(observableHistoryInjectable);

    return computed(() =>
      routeRegistrations.get().find(
        (route) =>
          !!matchPath(observableHistory.location.pathname, {
            path: route.path,
            exact: true,
          }),
      ),
    );
  },
});

export default currentRouteRegistrationInjectable;
