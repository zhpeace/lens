/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { HorizontalPodAutoscalers } from "./hpa";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const horizontalPodAutoscalersRouteInjectable = getInjectable({
  id: "horizontal-pod-autoscalers-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: HorizontalPodAutoscalers,
      path: "/hpa",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("horizontalpodautoscalers"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default horizontalPodAutoscalersRouteInjectable;
