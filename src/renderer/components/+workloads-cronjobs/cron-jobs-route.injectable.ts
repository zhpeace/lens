/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { CronJobs } from "./cronjobs";
import workloadsRouteInjectable from "../+workloads/workloads-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const cronJobsRouteInjectable = getInjectable({
  id: "cron-jobs-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "CronJobs",
      Component: CronJobs,
      path: "/cronjobs",
      parent: di.inject(workloadsRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("cronjobs"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default cronJobsRouteInjectable;
