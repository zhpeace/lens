/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import React from "react";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";

const helmSidebarItemsInjectable = getInjectable({
  id: "helm-sidebar-items",

  instantiate: () => {
    return computed(() => [
      {
        id: "helm",
        getIcon: () => <Icon material="apps" />,
        title: "Helm",
        url: `asd`,
        isActive: false,
        isVisible: true,
      },
    ]);
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default helmSidebarItemsInjectable;
