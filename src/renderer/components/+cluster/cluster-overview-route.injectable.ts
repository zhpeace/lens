/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { ClusterOverview } from "./cluster-overview";

const clusterOverviewRouteInjectable = getInjectable({
  id: "cluster-overview-route",
  instantiate: () => ({ path: "/overview", Component: ClusterOverview, clusterFrame: true }),
  injectionToken: routeInjectionToken,
});

export default clusterOverviewRouteInjectable;
