/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const replicasetsRouteInjectable = getInjectable({
  id: "replicasets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      path: "/replicasets",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("replicasets"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default replicasetsRouteInjectable;
