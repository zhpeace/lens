/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { CustomResourcesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const customResourcesRouteInjectable = getInjectable({
  id: "custom-resources-route",

  instantiate: () => ({
    path: "/crd/:group?/:name?",
    Component: CustomResourcesRoute,
    clusterFrame: true,
    isEnabled: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default customResourcesRouteInjectable;
