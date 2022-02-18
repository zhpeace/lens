/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { PersistentVolumeClaims } from "./volume-claims";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import storageRouteInjectable from "../+storage/storage-route.injectable";

const persistentVolumeClaimsRouteInjectable = getInjectable({
  id: "persistent-volume-claims-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable);

    return {
      title: "Persistent Volume Claims",
      Component: PersistentVolumeClaims,
      path: "/persistent-volume-claims",
      parent: di.inject(storageRouteInjectable),
      clusterFrame: true,
      mikko: () => isAllowedResource("persistentvolumeclaims"),
    };
  },

  injectionToken: routeInjectionToken,
});

export default persistentVolumeClaimsRouteInjectable;
