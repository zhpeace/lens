/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const clusterViewRouteInjectable = getInjectable({
  id: "cluster-view-route",

  instantiate: () => ({
    exact: true,
    path: "/cluster/:clusterId",
    clusterFrame: false,
    isEnabled: computed(() => true),
  }),

  injectionToken: routeInjectionToken,
});

export default clusterViewRouteInjectable;
