/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const clusterOverviewRouteInjectable = getInjectable({
  id: "cluster-overview-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      path: "/overview",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("nodes"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default clusterOverviewRouteInjectable;
