/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../../common/utils/is-allowed-resource.injectable";
import { ClusterRoleBindings } from "./view";
import { routeInjectionToken } from "../../../routes/all-routes.injectable";

const clusterRoleBindingsRouteInjectable = getInjectable({
  id: "cluster-role-bindings-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: ClusterRoleBindings,
      path: "/cluster-role-bindings",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("clusterrolebindings"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default clusterRoleBindingsRouteInjectable;
