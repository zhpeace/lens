/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { Secrets } from "./secrets";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const secretsRouteInjectable = getInjectable({
  id: "secrets-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: Secrets,
      path: "/secrets",
      clusterFrame: true,
      mikko: () => isAllowedResource("secrets"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default secretsRouteInjectable;
