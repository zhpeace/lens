/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { CrdList } from "./crd-list";
import { routeSpecificComponentInjectionToken } from "../../routes/route-specific-component-injection-token";
import crdListRouteInjectable from "./crd-list-route.injectable";

const crdListRouteComponentInjectable = getInjectable({
  id: "crd-list-route-component",

  instantiate: (di) => ({
    route: di.inject(crdListRouteInjectable),
    Component: CrdList,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default crdListRouteComponentInjectable;
