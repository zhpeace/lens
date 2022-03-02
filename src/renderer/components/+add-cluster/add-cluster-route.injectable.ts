/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const addClusterRouteInjectable = getInjectable({
  id: "add-cluster-route",

  instantiate: () => ({
    path: "/add-cluster",
    clusterFrame: false,
    isEnabled: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default addClusterRouteInjectable;
