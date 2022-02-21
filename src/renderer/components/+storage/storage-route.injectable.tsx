/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { StorageRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const storageRouteInjectable = getInjectable({
  id: "storage-route",

  instantiate: () => ({
    path: "/persistent-volume-claims",

    // path: [
    //   "/persistent-volume-claims",
    //   "/persistent-volumes",
    //   "/storage-classes",
    // ],

    Component: StorageRoute,
    clusterFrame: true,
    isEnabled: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default storageRouteInjectable;
