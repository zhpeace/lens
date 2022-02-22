/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { crdStore } from "./crd.store";
import kubeWatchApiInjectable from "../../kube-watch-api/kube-watch-api.injectable";

const customResourceDefinitionsInjectable = getInjectable({
  id: "custom-resource-definitions",

  instantiate: (di) => {
    const kubeWatchApi = di.inject(kubeWatchApiInjectable);

    kubeWatchApi.subscribeStores([crdStore]);

    return computed(() => [...crdStore.items]);
  },
});

export default customResourceDefinitionsInjectable;
