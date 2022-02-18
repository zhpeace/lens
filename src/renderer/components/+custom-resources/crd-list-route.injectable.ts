/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { CrdList } from "./crd-list";
import customResourcesRouteInjectable from "./custom-resources-route.injectable";

const crdListRouteInjectable = getInjectable({
  id: "crd-list-route",

  instantiate: (di) => ({
    title: "Definitions",
    Component: CrdList,
    path: "/crd/definitions",
    parent: di.inject(customResourcesRouteInjectable),
    clusterFrame: true,
    mikko: () => true,
    exact: true,
  }),

  injectionToken: routeInjectionToken,
});

export default crdListRouteInjectable;
