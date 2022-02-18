/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { NetworkPolicies } from "./network-policies";
import networkRouteInjectable from "../+network/network-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const networkPoliciesRouteInjectable = getInjectable({
  id: "network-policies-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "Network Policies",
      Component: NetworkPolicies,
      path: "/network-policies",
      parent: di.inject(networkRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("networkpolicies"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default networkPoliciesRouteInjectable;
