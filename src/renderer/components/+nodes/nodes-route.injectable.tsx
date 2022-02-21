/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NodesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const nodesRouteInjectable = getInjectable({
  id: "nodes-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      path: "/nodes",
      Component: NodesRoute,
      clusterFrame: true,
      isEnabled: () => isAllowedResource("nodes"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default nodesRouteInjectable;
