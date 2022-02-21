/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

const storageSidebarItemsInjectable = getInjectable({
  id: "storage-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "storage",
        getIcon: () => <Icon material="storage" />,
        title: "Storage",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default storageSidebarItemsInjectable;
