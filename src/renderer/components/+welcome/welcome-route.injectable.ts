/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { Welcome } from "./welcome";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const welcomeRouteInjectable = getInjectable({
  id: "welcome-route",

  instantiate: () => ({
    path: "/welcome",
    Component: Welcome,
    clusterFrame: false,
  }),

  injectionToken: routeInjectionToken,
});

export default welcomeRouteInjectable;
