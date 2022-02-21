/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { PodDisruptionBudgets } from "./pod-disruption-budgets";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const podDisruptionBudgetsRouteInjectable = getInjectable({
  id: "pod-disruption-budgets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return ({
      Component: PodDisruptionBudgets,
      path: "/poddisruptionbudgets",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("poddisruptionbudgets"),
    });
  },

  injectionToken: routeInjectionToken,
});

export default podDisruptionBudgetsRouteInjectable;
