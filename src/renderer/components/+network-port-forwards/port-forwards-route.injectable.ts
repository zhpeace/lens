/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { PortForwards } from "./port-forwards";
import networkRouteInjectable from "../+network/network-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const portForwardsRouteInjectable = getInjectable({
  id: "port-forwards-route",

  instantiate: (di) => ({
    title: "Port Forwarding",
    Component: PortForwards,
    path: "/port-forwards/:forwardport?",
    parent: di.inject(networkRouteInjectable),
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default portForwardsRouteInjectable;
