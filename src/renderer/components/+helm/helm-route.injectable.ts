/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { HelmRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const helmRouteInjectable = getInjectable({
  id: "helm-route",

  instantiate: () => ({
    path: "/helm",
    Component: HelmRoute,
    clusterFrame: true,
  }),

  injectionToken: routeInjectionToken,
});

export default helmRouteInjectable;
