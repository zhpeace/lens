/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import React from "react";
import {
  SidebarItemRegistration,
  sidebarItemsInjectionToken,
} from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import { noop } from "lodash/fp";

export const helmSidebarItemId = "helm";

const helmSidebarItemsInjectable = getInjectable({
  id: "helm-sidebar-items",

  instantiate: () =>
    computed((): SidebarItemRegistration[] => [
      {
        id: helmSidebarItemId,
        parentId: null,
        getIcon: () => <Icon material="apps" />,
        title: "Helm",
        onClick: noop,
        priority: 90,
      },
    ]),

  injectionToken: sidebarItemsInjectionToken,
});

export default helmSidebarItemsInjectable;
