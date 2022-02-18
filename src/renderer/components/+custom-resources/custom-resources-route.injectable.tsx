/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { CustomResourcesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const customResourcesRouteInjectable = getInjectable({
  id: "custom-resources-route",

  instantiate: () => ({
    title: "Custom Resources",
    getIcon: () => <Icon material="extension" />,
    path: "/crd",
    Component: CustomResourcesRoute,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default customResourcesRouteInjectable;
