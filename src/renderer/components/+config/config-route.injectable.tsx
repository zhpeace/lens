/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { ConfigRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const configRouteInjectable = getInjectable({
  id: "config-route",

  instantiate: () => ({
    title: "Config",
    getIcon: () => <Icon material="list" />,

    path: "/configmaps",

    // path: [
    //   "/configmaps",
    //   "/secrets",
    //   "/resourcequotas",
    //   "/limitranges",
    //   "/hpa",
    //   "/poddisruptionbudgets",
    // ],

    Component: ConfigRoute,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default configRouteInjectable;
