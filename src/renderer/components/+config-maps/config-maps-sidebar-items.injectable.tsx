/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const configMapsSidebarItemsInjectable = getInjectable({
  id: "config-maps-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "config-maps",
        parentId: "config",
        title: "ConfigMaps",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default configMapsSidebarItemsInjectable;
