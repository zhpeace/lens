/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const persistentVolumeClaimsRouteInjectable = getInjectable({
  id: "persistent-volume-claims-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      path: "/persistent-volume-claims",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("persistentvolumeclaims"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default persistentVolumeClaimsRouteInjectable;
