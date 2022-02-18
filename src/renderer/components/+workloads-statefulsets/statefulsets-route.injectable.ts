/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { StatefulSets } from "./statefulsets";
import workloadsRouteInjectable from "../+workloads/workloads-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const statefulsetsRouteInjectable = getInjectable({
  id: "statefulsets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "StatefulSets",
      Component: StatefulSets,
      path: "/statefulsets",
      parent: di.inject(workloadsRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("statefulsets"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default statefulsetsRouteInjectable;
