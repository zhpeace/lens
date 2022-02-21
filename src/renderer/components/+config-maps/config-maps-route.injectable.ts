/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { ConfigMaps } from "./config-maps";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const configMapsRouteInjectable = getInjectable({
  id: "config-maps-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return ({
      Component: ConfigMaps,
      path: "/configmaps",
      clusterFrame: true,
      mikko: () => isAllowedResource("configmaps"),
    });
  },

  injectionToken: routeInjectionToken,
});

export default configMapsRouteInjectable;
