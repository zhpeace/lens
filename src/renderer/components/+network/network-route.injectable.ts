/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NetworkRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const networkRouteInjectable = getInjectable({
  id: "network-route",

  instantiate: () => ({
    title: "Network",
    icon: "apps",

    path: "/services",

    // path: [
    //   "/services",
    //   "/endpoints",
    //   "/ingresses",
    //   "/network-policies",
    //   "/port-forwards/:forwardport?",
    // ],

    Component: NetworkRoute,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default networkRouteInjectable;
