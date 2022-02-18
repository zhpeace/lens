/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { PersistentVolumes } from "./volumes";
import storageRouteInjectable from "../+storage/storage-route.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const persistentVolumesInjectable = getInjectable({
  id: "persistent-volumes",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "Persistent Volumes",
      Component: PersistentVolumes,
      path: "/persistent-volumes",
      parent: di.inject(storageRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("persistentvolumes"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default persistentVolumesInjectable;
