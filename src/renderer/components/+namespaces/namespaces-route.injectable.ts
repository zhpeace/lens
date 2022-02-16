/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NamespacesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const namespacesRouteInjectable = getInjectable({
  id: "namespaces-route",

  instantiate: () => (  {
    path: "/namespaces",
    Component: NamespacesRoute,
    clusterFrame: true,
  }),

  injectionToken: routeInjectionToken,
});

export default namespacesRouteInjectable;
