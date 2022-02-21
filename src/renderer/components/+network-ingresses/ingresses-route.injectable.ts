/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { Ingresses } from "./ingresses";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const ingressesRouteInjectable = getInjectable({
  id: "ingresses-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: Ingresses,
      path: "/ingresses",
      clusterFrame: true,
      mikko: () => isAllowedResource("ingresses"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default ingressesRouteInjectable;
