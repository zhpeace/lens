/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const statefulsetsRouteInjectable = getInjectable({
  id: "statefulsets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      path: "/statefulsets",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("statefulsets"),
      priority: 50,
    };
  },

  injectionToken: routeInjectionToken,
});

export default statefulsetsRouteInjectable;
