/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const resourceQuotasRouteInjectable = getInjectable({
  id: "resource-quotas-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      path: "/resourcequotas",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("resourcequotas"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default resourceQuotasRouteInjectable;
