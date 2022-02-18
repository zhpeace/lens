/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { DaemonSets } from "./daemonsets";
import workloadsRouteInjectable from "../+workloads/workloads-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const daemonsetsRouteInjectable = getInjectable({
  id: "daemonsets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "DaemonSets",
      Component: DaemonSets,
      path: "/daemonsets",
      parent: di.inject(workloadsRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("daemonsets"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default daemonsetsRouteInjectable;
