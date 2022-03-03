/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { crdStore } from "./crd.store";
import subscribeStoresInjectable from "../../kube-watch-api/subscribe-stores.injectable";

const customResourceDefinitionsInjectable = getInjectable({
  id: "custom-resource-definitions",

  instantiate: (di) => {
    const subscribeStores = di.inject(subscribeStoresInjectable);

    subscribeStores([crdStore]);

    return computed(() => [...crdStore.items]);
  },
});

export default customResourceDefinitionsInjectable;
