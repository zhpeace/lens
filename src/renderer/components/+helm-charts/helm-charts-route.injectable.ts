/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { HelmCharts } from "./helm-charts";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const helmChartsRouteInjectable = getInjectable({
  id: "helm-charts-route",

  instantiate: () => ({
    path: `/helm/charts/:repo?/:chartName?`,
    Component: HelmCharts,
    clusterFrame: true,
    isEnabled: () => true,
  }),

  injectionToken: routeInjectionToken,
});

export default helmChartsRouteInjectable;
