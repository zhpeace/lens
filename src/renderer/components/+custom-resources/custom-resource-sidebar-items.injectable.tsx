/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { groupBy } from "lodash/fp";
import toPairs from "lodash/toPairs";
import { computed } from "mobx";

import customResourceDefinitionsInjectable from "./custom-resources.injectable";
import { sidebarItemsInjectionToken } from "../layout/sidebar-items.injectable";
import { Icon } from "../icon";
import React from "react";

import isActiveRouteInjectable from "../../routes/is-active-route.injectable";
import hasAccessToRouteInjectable from "../../routes/has-access-to-route.injectable";
import { getUrl } from "../../routes/get-url";
import customResourcesRouteInjectable from "./custom-resources-route.injectable";
import crdListRouteInjectable from "./crd-list-route.injectable";

const customResourceSidebarItemsInjectable = getInjectable({
  id: "custom-resource-sidebar-items",

  instantiate: (di) => {
    const crdRoute = di.inject(customResourcesRouteInjectable);
    const crdListRoute = di.inject(crdListRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);

    const allCrds = di.inject(customResourceDefinitionsInjectable);

    return computed(() => {
      const groupedCrds = toPairs(groupBy((x) => x.getGroup(), allCrds.get()));

      const rootItem = {
        id: "custom-resources",
        title: "Custom Resources",
        getIcon: () => <Icon material="extension" />,
        url: getUrl(crdRoute),
        isActive: isActiveRoute(crdRoute),
        isVisible: hasAccessToRoute(crdRoute),
      };

      return [
        rootItem,

        ...groupedCrds.flatMap(([group, definitions]) => {
          const parentGroupId = `custom-resources-group-${group}`;

          const groupParent = {
            id: parentGroupId,
            parentId: "custom-resources",
            title: group,
            url: getUrl(crdListRoute, { query: { groups: group }}),
            isActive: isActiveRoute(crdListRoute),
            isVisible: hasAccessToRoute(crdListRoute),
          };

          return [
            groupParent,

            ...definitions.map((crd) => {
              const title = crd.getResourceKind();

              return {
                id: `${parentGroupId}-${title}`,
                parentId: parentGroupId,
                title,

                url: getUrl(crdRoute, {
                  path: { group: crd.getGroup(), name: crd.getPluralName() },
                }),

                isActive: isActiveRoute(crdListRoute),
                isVisible: hasAccessToRoute(crdListRoute),
              };
            }),
          ];
        }),
      ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default customResourceSidebarItemsInjectable;
