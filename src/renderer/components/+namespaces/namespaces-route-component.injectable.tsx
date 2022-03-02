/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NamespacesRoute } from "./route";
import namespacesRouteInjectable from "./namespaces-route.injectable";
import { routeSpecificComponentInjectionToken } from "../../routes/route-specific-component-injection-token";

const namespacesRouteComponentInjectable = getInjectable({
  id: "namespaces-route-component",

  instantiate: (di) => ({
    route: di.inject(namespacesRouteInjectable),
    Component: NamespacesRoute,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default namespacesRouteComponentInjectable;
