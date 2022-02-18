/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { UserManagementRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const userManagementRouteInjectable = getInjectable({
  id: "user-management-route",

  instantiate: () => ({
    title: "User Management",
    icon: "apps",
    path: "/pod-security-policies",

    // path: [
    //   // "/service-accounts",
    //   "/pod-security-policies",
    //   "/role-bindings",
    //   "/cluster-role-bindings",
    //   "/roles",
    //   // "/cluster-roles",
    // ],

    Component: UserManagementRoute,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default userManagementRouteInjectable;
