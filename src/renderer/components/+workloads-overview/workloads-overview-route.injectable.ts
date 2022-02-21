/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { WorkloadsOverview } from "./overview";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const workloadsOverviewRouteInjectable = getInjectable({
  id: "workloads-overview-route",

  instantiate: () => ({
    Component: WorkloadsOverview,
    path: "/workloads",
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default workloadsOverviewRouteInjectable;
