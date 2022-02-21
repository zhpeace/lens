/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { DaemonSets } from "./daemonsets";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const daemonsetsRouteInjectable = getInjectable({
  id: "daemonsets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: DaemonSets,
      path: "/daemonsets",
      clusterFrame: true,
      mikko: () => isAllowedResource("daemonsets"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default daemonsetsRouteInjectable;
