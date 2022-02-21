/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Route } from "./all-routes.injectable";

const hasAccessToRouteInjectable = getInjectable({
  id: "has-access-to-route",
  instantiate: () => (route: Route) => route.mikko(),
});

export default hasAccessToRouteInjectable;
