/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const helmReleasesRouteInjectable = getInjectable({
  id: "helm-releases-route",

  instantiate: () => ({
    path: `/helm/releases/:repo?/:chartName?`,
    clusterFrame: true,
    isEnabled: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default helmReleasesRouteInjectable;
