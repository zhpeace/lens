/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Route } from "./all-routes.injectable";

const isActiveRoute = () => (route: Route) => false;

const isActiveRouteInjectable = getInjectable({
  id: "is-active-route",
  instantiate: (di) => isActiveRoute(),
});

export default isActiveRouteInjectable;
