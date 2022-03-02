/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { PodDisruptionBudgets } from "./pod-disruption-budgets";
import podDisruptionBudgetsRouteInjectable from "./pod-disruption-budgets-route.injectable";
import { routeSpecificComponentInjectionToken } from "../../routes/route-specific-component-injection-token";

const podDisruptionBudgetsRouteComponentInjectable = getInjectable({
  id: "pod-disruption-budgets-route-component",

  instantiate: (di) => ({
    route: di.inject(podDisruptionBudgetsRouteInjectable),
    Component: PodDisruptionBudgets,
  }),

  injectionToken: routeSpecificComponentInjectionToken,
});

export default podDisruptionBudgetsRouteComponentInjectable;
