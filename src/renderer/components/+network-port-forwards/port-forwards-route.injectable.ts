/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { PortForwards } from "./port-forwards";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const portForwardsRouteInjectable = getInjectable({
  id: "port-forwards-route",

  instantiate: () => ({
    Component: PortForwards,
    path: "/port-forwards/:forwardport?",
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default portForwardsRouteInjectable;
