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

export const storageSidebarItemId = "storage";

const storageSidebarItemsInjectable = getInjectable({
  id: "storage-sidebar-items",

  instantiate: () =>
    computed((): ISidebarItem[] => [
      {
        id: storageSidebarItemId,
        parentId: null,
        getIcon: () => <Icon material="storage" />,
        title: "Storage",
        onClick: noop,
        priority: 60,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default storageSidebarItemsInjectable;
