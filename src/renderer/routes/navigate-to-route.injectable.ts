/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Route } from "./all-routes.injectable";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { buildURL } from "../../common/utils/buildUrl";
import { runInAction } from "mobx";

const navigateToRouteInjectable = getInjectable({
  id: "navigate-to-route",

  instantiate: (di) => {
    const observableHistory = di.inject(observableHistoryInjectable);

    return (route: Route, parameters = {}) => {
      const url = buildURL(route.path)(parameters);

      runInAction(() => {
        observableHistory.push(url);
      });
    };
  },
});

export default navigateToRouteInjectable;
