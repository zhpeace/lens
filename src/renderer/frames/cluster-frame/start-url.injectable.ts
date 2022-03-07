/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { KubeResource } from "../../../common/rbac";
import * as routes from "../../../common/routes";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const startUrlInjectable = getInjectable({
  id: "start-url",

  instantiate: (di) => {
    const isAllowedResource = (resourceName: any) => di.inject(isAllowedResourceInjectable, resourceName);

    return computed(() => {
      const resources: KubeResource[] = ["events", "nodes", "pods"];

      return resources.every((resourceName) => isAllowedResource(resourceName))
        ? routes.clusterURL()
        : routes.workloadsURL();
    });
  },
});

export default startUrlInjectable;
