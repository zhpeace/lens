/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { some } from "lodash/fp";
import { computed } from "mobx";

import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

import { getUrl } from "../../routes/get-url";
import crdListRouteInjectable from "./crd-list-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import sidebarItemsForDefinitionGroupsInjectable from "./sidebar-items-for-definition-groups.injectable";

const customResourceSidebarItemsInjectable = getInjectable({
  id: "custom-resource-sidebar-items",

  instantiate: (di) => {
    const crdListRoute = di.inject(crdListRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    const definitionGroupSidebarItems = di.inject(
      sidebarItemsForDefinitionGroupsInjectable,
    );

    return computed(() => {
      const route = currentRoute.get();

      const definitionsItem = {
        title: "Definitions",
        url: getUrl(crdListRoute),
        isActive: route === crdListRoute,
        isVisible: crdListRoute.mikko(),
      };

      const definitionGroupItems = definitionGroupSidebarItems.get();

      const childrenAndGrandChildren = [
        definitionsItem,
        ...definitionGroupItems.flatMap((item) => item.children),
      ];

      const parentItem = {
        title: "Custom Resources",
        getIcon: () => <Icon material="extension" />,
        url: "asd",

        isActive: some({ isActive: true }, childrenAndGrandChildren),
        isVisible: some({ isVisible: true }, childrenAndGrandChildren),

        children: [definitionsItem, ...definitionGroupItems],
      };

      return [parentItem];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default customResourceSidebarItemsInjectable;
