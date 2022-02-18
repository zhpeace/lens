/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { TabLayoutRoute } from "../layout/tab-layout";
import type { IsAllowedResource } from "../../../common/utils/is-allowed-resource.injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

interface Dependencies {
  isAllowedResource: IsAllowedResource;
}

function getRouteTabs({ isAllowedResource }: Dependencies) {
  return computed(() => {
    const tabs: TabLayoutRoute[] = [];


    return tabs;
  });
}

const userManagementRouteTabsInjectable = getInjectable({
  id: "user-management-route-tabs",

  instantiate: (di) => getRouteTabs({
    isAllowedResource: di.inject(isAllowedResourceInjectable),
  }),
});

export default userManagementRouteTabsInjectable;
