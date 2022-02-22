/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { computed, onBecomeObserved, onBecomeUnobserved } from "mobx";
import { crdStore } from "./crd.store";
import kubeWatchApiInjectable from "../../kube-watch-api/kube-watch-api.injectable";

const customResourceDefinitionsInjectable = getInjectable({
  id: "custom-resource-definitions",

  instantiate: (di) => {
    const crds = computed(() => [...crdStore.items]);

    // TODO: Replace with explicit call to get CRDs to allow deletion of subscribe/unsubscribe
    //  based on observation status.
    const kubeWatchApi = di.inject(kubeWatchApiInjectable);

    let disposer: () => void;

    onBecomeObserved(crds, () => {
      disposer = kubeWatchApi.subscribeStores([crdStore]);
    });

    onBecomeUnobserved(crds, () => {
      if (disposer) {
        disposer();
      }
    });

    return crds;
  },
});

export default customResourceDefinitionsInjectable;
