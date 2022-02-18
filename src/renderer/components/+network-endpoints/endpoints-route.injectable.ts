/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { Endpoints } from "./endpoints";
import networkRouteInjectable from "../+network/network-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const endpointsRouteInjectable = getInjectable({
  id: "endpoints-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "Endpoints",
      Component: Endpoints,
      path: "/endpoints",
      parent: di.inject(networkRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("endpoints"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default endpointsRouteInjectable;
