/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const crdListRouteInjectable = getInjectable({
  id: "crd-list-route",

  instantiate: () => ({
    path: "/crd/definitions",
    clusterFrame: true,
    isEnabled: () => true,
    exact: true,
  }),

  injectionToken: routeInjectionToken,
});

export default crdListRouteInjectable;
