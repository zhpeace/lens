/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { Ingresses } from "./ingresses";
import networkRouteInjectable from "../+network/network-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const ingressesRouteInjectable = getInjectable({
  id: "ingresses-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "Ingresses",
      Component: Ingresses,
      path: "/ingresses",
      parent: di.inject(networkRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("ingresses"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default ingressesRouteInjectable;
