/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

const namespacesSidebarItemsInjectable = getInjectable({
  id: "namespaces",

  instantiate: () =>
    computed(() => [
      {
        id: "namespaces",
        getIcon: () => <Icon material="layers" />,
        title: "Namespaces",
        url: `asd`,
        isActive: false,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default namespacesSidebarItemsInjectable;
