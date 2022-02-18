/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { StorageRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const storageRouteInjectable = getInjectable({
  id: "storage-route",

  instantiate: () => ({
    title: "Storage",
    getIcon: () => <Icon material="storage" />,

    path: "/persistent-volume-claims",

    // path: [
    //   "/persistent-volume-claims",
    //   "/persistent-volumes",
    //   "/storage-classes",
    // ],

    Component: StorageRoute,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default storageRouteInjectable;
