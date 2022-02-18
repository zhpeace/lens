/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NodesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const nodesRouteInjectable = getInjectable({
  id: "nodes-route",

  instantiate: () => ({
    title: "Nodes",
    getIcon: () => <Icon material="nodes" />,
    path: "/nodes",
    Component: NodesRoute,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default nodesRouteInjectable;
