/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectionToken } from "@ogre-tools/injectable";
import type { Route } from "./all-routes.injectable";

export const routeSpecificComponentInjectionToken = getInjectionToken<{
  route: Route;
  Component: React.ElementType;
}>({
  id: "route-specific-component-injection-token",
});
