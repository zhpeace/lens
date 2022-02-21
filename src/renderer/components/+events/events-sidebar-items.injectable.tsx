/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import React from "react";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";

const eventsSidebarItemsInjectable = getInjectable({
  id: "events-sidebar-items",

  instantiate: () =>
    computed(() => [
      {
        id: "events",
        getIcon: () => <Icon material="access_time" />,
        title: "Events",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default eventsSidebarItemsInjectable;
