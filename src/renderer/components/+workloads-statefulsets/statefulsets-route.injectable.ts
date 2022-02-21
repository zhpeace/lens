/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { StatefulSets } from "./statefulsets";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const statefulsetsRouteInjectable = getInjectable({
  id: "statefulsets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: StatefulSets,
      path: "/statefulsets",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("statefulsets"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default statefulsetsRouteInjectable;
