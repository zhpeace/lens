/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";
import { noop } from "lodash/fp";
import type { ISidebarItem } from "../layout/sidebar";

export const workloadsSidebarItemId = "workloads";

const workloadsSidebarItemsInjectable = getInjectable({
  id: "workloads-sidebar-items",

  instantiate: () =>
    computed((): ISidebarItem[] => [
      {
        id: workloadsSidebarItemId,
        parentId: null,
        title: "Workloads",
        getIcon: () => <Icon svg="workloads" />,
        onClick: noop,
        priority: 20,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default workloadsSidebarItemsInjectable;
