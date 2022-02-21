/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { groupBy, matches } from "lodash/fp";
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
import pathParametersInjectable from "../../routes/path-parameters.injectable";

const customResourceSidebarItemsInjectable = getInjectable({
  id: "custom-resource-sidebar-items",

  instantiate: (di) => {
    const crdRoute = di.inject(customResourcesRouteInjectable);
    const crdListRoute = di.inject(crdListRouteInjectable);
    const isActiveRoute = di.inject(isActiveRouteInjectable);
    const hasAccessToRoute = di.inject(hasAccessToRouteInjectable);
    const pathParameters = di.inject(pathParametersInjectable);

    const allCrds = di.inject(customResourceDefinitionsInjectable);

    return computed(() => {
      const groupedCrds = toPairs(groupBy((x) => x.getGroup(), allCrds.get()));

      const currentPathParameters = pathParameters.get();

      const rootItem = {
        id: "custom-resources",
        title: "Custom Resources",
        getIcon: () => <Icon material="extension" />,
        url: getUrl(crdRoute),
        isActive: isActiveRoute(crdRoute),
        isVisible: hasAccessToRoute(crdRoute),
      };

      const definitionsItem = {
        id: "custom-resource-definitions",
        title: "Definitions",
        parentId: "custom-resources",
        url: getUrl(crdListRoute),
        isActive: isActiveRoute(crdListRoute),
        isVisible: hasAccessToRoute(crdListRoute),
      };

      return [
        rootItem,

        definitionsItem,

        ...groupedCrds.flatMap(([group, definitions]) => {
          const parentGroupId = `custom-resources-group-${group}`;

          const groupParent = {
            id: parentGroupId,
            parentId: "custom-resources",
            title: group,
            url: getUrl(crdListRoute, { query: { groups: group }}),
            isActive: false,
            isVisible: hasAccessToRoute(crdListRoute),
          };

          return [
            groupParent,

            ...definitions.map((crd) => {
              const title = crd.getResourceKind();

              const crdPathParameters = { group: crd.getGroup(), name: crd.getPluralName() };
              const crdIsActive = isActiveRoute(crdRoute) && matches(crdPathParameters, currentPathParameters);

              return {
                id: `${parentGroupId}-${title}`,
                parentId: parentGroupId,
                title,

                url: getUrl(crdRoute, {
                  path: crdPathParameters,
                }),

                isActive: crdIsActive,
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
