/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { Services } from "./services";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const servicesRouteInjectable = getInjectable({
  id: "services-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: Services,
      path: "/services",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("services"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default servicesRouteInjectable;
