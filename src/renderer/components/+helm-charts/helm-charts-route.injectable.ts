/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { HelmCharts } from "./helm-charts";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import helmRouteInjectable from "../+helm/helm-route.injectable";

const helmChartsRouteInjectable = getInjectable({
  id: "helm-charts-route",

  instantiate: (di) => ({
    title: "Charts",
    icon: null,
    path: `/helm/charts/:repo?/:chartName?`,
    Component: HelmCharts,
    clusterFrame: true,
    mikko: () => true,
    parent: di.inject(helmRouteInjectable),
  }),

  injectionToken: routeInjectionToken,
});

export default helmChartsRouteInjectable;
