/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { ConfigRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const configRouteInjectable = getInjectable({
  id: "config-route",

  instantiate: () => ({
    title: "Config",
    icon: "apps",

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
