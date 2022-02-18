/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const helmRouteInjectable = getInjectable({
  id: "helm-route",

  instantiate: () => ({
    title: "Helm",
    getIcon: () => <Icon material="apps" />,
    path: "/helm",
    Component: (): null => null,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default helmRouteInjectable;
