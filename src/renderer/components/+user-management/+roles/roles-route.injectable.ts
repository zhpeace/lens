/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { Roles } from "./view";
import { routeInjectionToken } from "../../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../../common/utils/is-allowed-resource.injectable";

const rolesRouteInjectable = getInjectable({
  id: "roles-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return ({
      Component: Roles,
      path: "/roles",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("roles"),
    });
  },

  injectionToken: routeInjectionToken,
});

export default rolesRouteInjectable;
