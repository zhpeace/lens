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
import sidebarItemsForDefinitionsInjectable from "./sidebar-items-for-definitions.injectable";

const customResourceSidebarItemsInjectable = getInjectable({
  id: "custom-resource-sidebar-items",

  instantiate: (di) => {
    const crdListRoute = di.inject(crdListRouteInjectable);
    const currentRoute = di.inject(currentRouteInjectable);
    const sidebarItemsForDefinitions = di.inject(sidebarItemsForDefinitionsInjectable);

    return computed(() => {
      const route = currentRoute.get();

      const parentItemId = "custom-resources";

      const definitionsItem = {
        id: "custom-resource-definitions",
        title: "Definitions",
        parentId: parentItemId,
        url: getUrl(crdListRoute),
        isActive: route === crdListRoute,
        isVisible: crdListRoute.mikko(),
      };

      const childItems = [definitionsItem, ...sidebarItemsForDefinitions.get()];

      const parentItem = {
        id: parentItemId,
        title: "Custom Resources",
        getIcon: () => <Icon material="extension" />,
        url: "asd",
        isActive: some({ isActive: true }, childItems),
        isVisible: some({ isVisible: true }, childItems),
      };

      return [parentItem, ...childItems];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default customResourceSidebarItemsInjectable;
