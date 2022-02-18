/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import isAllowedResourceInjectable, { IsAllowedResource } from "../../../common/utils/is-allowed-resource.injectable";
import type { TabLayoutRoute } from "../layout/tab-layout";

interface Dependencies {
  isAllowedResource: IsAllowedResource;
}

function getRouteTabs({ isAllowedResource }: Dependencies) {
  return computed(() => {
    const tabs: TabLayoutRoute[] = [];

    return tabs;
  });
}

const configRoutesInjectable = getInjectable({
  id: "config-routes",

  instantiate: (di) => getRouteTabs({
    isAllowedResource: di.inject(isAllowedResourceInjectable),
  }),
});

export default configRoutesInjectable;
