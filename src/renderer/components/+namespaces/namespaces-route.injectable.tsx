/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NamespacesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const namespacesRouteInjectable = getInjectable({
  id: "namespaces-route",

  instantiate: () => ({
    title: "Namespaces",
    getIcon: () => <Icon material="layers" />,
    path: "/namespaces",
    Component: NamespacesRoute,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default namespacesRouteInjectable;
