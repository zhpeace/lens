/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { WorkloadsRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const workloadsRouteInjectable = getInjectable({
  id: "workloads-route",

  instantiate: () => (  {
    path: [
      "/workloads",
      "/pods",
      "/deployments",
      "/daemonsets",
      "/statefulsets",
      "/replicasets",
      "/jobs",
      "/cronjobs",
    ],

    Component: WorkloadsRoute,
    clusterFrame: true,
  }),

  injectionToken: routeInjectionToken,
});

export default workloadsRouteInjectable;
