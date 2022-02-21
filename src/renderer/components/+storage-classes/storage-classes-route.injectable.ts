/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { StorageClasses } from "./storage-classes";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const storageClassesRouteInjectable = getInjectable({
  id: "storage-classes-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: StorageClasses,
      path: "/storage-classes",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("storageclasses"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default storageClassesRouteInjectable;
