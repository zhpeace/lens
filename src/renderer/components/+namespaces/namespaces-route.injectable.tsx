/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NamespacesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const namespacesRouteInjectable = getInjectable({
  id: "namespaces-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      path: "/namespaces",
      Component: NamespacesRoute,
      clusterFrame: true,
      isEnabled: () => isAllowedResource("namespaces"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default namespacesRouteInjectable;
