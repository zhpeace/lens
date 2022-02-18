/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NetworkRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const networkRouteInjectable = getInjectable({
  id: "network-route",

  instantiate: () => ({
    title: "Network",
    getIcon: () => <Icon material="device_hub" />,

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
