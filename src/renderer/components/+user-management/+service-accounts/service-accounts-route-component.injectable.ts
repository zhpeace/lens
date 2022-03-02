/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { ServiceAccounts } from "./view";
import serviceAccountsRouteInjectable from "./service-accounts-route.injectable";
import { routeSpecificComponentInjectionToken } from "../../../routes/route-specific-component-injection-token";

const serviceAccountsRouteComponentInjectable = getInjectable({
  id: "service-accounts-route-component",

  instantiate: (di) => ({
    route: di.inject(serviceAccountsRouteInjectable),
    Component: ServiceAccounts,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default serviceAccountsRouteComponentInjectable;
