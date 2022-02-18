/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { AddCluster } from "./add-cluster";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const addClusterRouteInjectable = getInjectable({
  id: "add-cluster-route",

  instantiate: () => ({
    title: "Add cluster",
    path: "/add-cluster",
    Component: AddCluster,
    clusterFrame: false,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default addClusterRouteInjectable;
