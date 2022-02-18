/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { Events } from "./events";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const eventsRouteInjectable = getInjectable({
  id: "events-route",

  instantiate: () => ({
    title: "Events",
    getIcon: () => <Icon material="access_time" />,
    path: "/events",
    Component: Events,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default eventsRouteInjectable;
