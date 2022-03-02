/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { ClusterRoles } from "./view";
import clusterRolesRouteInjectable from "./cluster-roles-route.injectable";
import { routeSpecificComponentInjectionToken } from "../../../routes/route-specific-component-injection-token";

const clusterRolesRouteComponentInjectable = getInjectable({
  id: "cluster-roles-route-component",

  instantiate: (di) => ({
    route: di.inject(clusterRolesRouteInjectable),
    Component: ClusterRoles,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default clusterRolesRouteComponentInjectable;
