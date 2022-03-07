/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const limitRangesRouteInjectable = getInjectable({
  id: "limit-ranges-route",

  instantiate: (di) => {
    const limitRangesIsAllowed = di.inject(
      isAllowedResourceInjectable,
      "limitranges",
    );

    return {
      path: "/limitranges",
      clusterFrame: true,
      isEnabled: limitRangesIsAllowed,
    };
  },

  injectionToken: routeInjectionToken,
});

export default limitRangesRouteInjectable;
