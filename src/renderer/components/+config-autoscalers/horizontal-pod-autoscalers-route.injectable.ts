/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { HorizontalPodAutoscalers } from "./hpa";
import configRouteInjectable from "../+config/config-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const horizontalPodAutoscalersRouteInjectable = getInjectable({
  id: "horizontal-pod-autoscalers-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "HPA",
      Component: HorizontalPodAutoscalers,
      path: "/hpa",
      parent: di.inject(configRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("horizontalpodautoscalers"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default horizontalPodAutoscalersRouteInjectable;
