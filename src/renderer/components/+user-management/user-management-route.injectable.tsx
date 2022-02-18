/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { UserManagementRoute } from "./route";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { Icon } from "../icon";
import React from "react";

const userManagementRouteInjectable = getInjectable({
  id: "user-management-route",

  instantiate: () => ({
    title: "User Management",
    getIcon: () => <Icon material="security" />,
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
