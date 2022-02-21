/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { Endpoints } from "./endpoints";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const endpointsRouteInjectable = getInjectable({
  id: "endpoints-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: Endpoints,
      path: "/endpoints",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("endpoints"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default endpointsRouteInjectable;
