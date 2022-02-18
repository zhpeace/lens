/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { Deployments } from "./deployments";
import workloadsRouteInjectable from "../+workloads/workloads-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const deploymentsRouteInjectable = getInjectable({
  id: "deployments-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "Deployments",
      Component: Deployments,
      path: "/deployments",
      parent: di.inject(workloadsRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("deployments"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default deploymentsRouteInjectable;
