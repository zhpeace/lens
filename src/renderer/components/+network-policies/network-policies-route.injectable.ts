/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { NetworkPolicies } from "./network-policies";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const networkPoliciesRouteInjectable = getInjectable({
  id: "network-policies-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: NetworkPolicies,
      path: "/network-policies",
      clusterFrame: true,
      mikko: () => isAllowedResource("networkpolicies"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default networkPoliciesRouteInjectable;
