/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";

const jobsSidebarItemsInjectable = getInjectable({
  id: "jobs-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "jobs",
        title: "Jobs",
        parentId: "workloads",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default jobsSidebarItemsInjectable;
