/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { PersistentVolumes } from "./volumes";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const persistentVolumesRouteInjectable = getInjectable({
  id: "persistent-volumes-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      Component: PersistentVolumes,
      path: "/persistent-volumes",
      clusterFrame: true,
      isEnabled: () => isAllowedResource("persistentvolumes"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default persistentVolumesRouteInjectable;
