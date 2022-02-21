/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";

import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const limitRangesSidebarItemsInjectable = getInjectable({
  id: "limit-ranges-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "limit-ranges",
        parentId: "config",
        title: "Limit Ranges",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default limitRangesSidebarItemsInjectable;
