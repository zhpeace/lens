/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const portForwardsRouteInjectable = getInjectable({
  id: "port-forwards-route",

  instantiate: () => ({
    path: "/port-forwards/:forwardport?",
    clusterFrame: true,
    isEnabled: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default portForwardsRouteInjectable;
