/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { Preferences } from "./preferences";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const preferencesRouteInjectable = getInjectable({
  id: "preferences-route",

  instantiate: () => ({
    title: "Preferences",
    path: "/preferences",
    Component: Preferences,
    clusterFrame: false,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default preferencesRouteInjectable;
