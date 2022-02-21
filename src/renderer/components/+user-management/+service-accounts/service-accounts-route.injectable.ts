/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { ServiceAccounts } from "./view";
import { routeInjectionToken } from "../../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../../common/utils/is-allowed-resource.injectable";

const serviceAccountsRouteInjectable = getInjectable({
  id: "service-accounts-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: ServiceAccounts,
      path: "/service-accounts",
      clusterFrame: true,
      mikko: () => isAllowedResource("serviceaccounts"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default serviceAccountsRouteInjectable;
