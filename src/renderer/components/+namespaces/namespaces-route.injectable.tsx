/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NamespacesRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const namespacesRouteInjectable = getInjectable({
  id: "namespaces-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "Namespaces",
      getIcon: () => <Icon material="layers" />,
      path: "/namespaces",
      Component: NamespacesRoute,
      clusterFrame: true,
      mikko: () => isAllowedResource("namespaces"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default namespacesRouteInjectable;
