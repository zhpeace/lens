/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import { HelmReleases } from "./releases";
import helmRouteInjectable from "../+helm/helm-route.injectable";

const helmReleasesRouteInjectable = getInjectable({
  id: "helm-releases-route",

  instantiate: (di) => ({
    title: "Releases",
    icon: null,
    path: `/helm/releases/:repo?/:chartName?`,
    parent: di.inject(helmRouteInjectable),
    Component: HelmReleases,
    clusterFrame: true,
    mikko: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default helmReleasesRouteInjectable;
