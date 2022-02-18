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
import type { ISidebarItem } from "../layout/sidebar";
import { Icon } from "../icon";
import React from "react";

const customResourceSidebarItemsInjectable = getInjectable({
  id: "custom-resource-sidebar-items",

  instantiate: (di) => {
    const customResourcesDefinitions = di.inject(
      customResourceDefinitionsInjectable,
    );

    return computed((): ISidebarItem[] => {
      const asd = toPairs(
        groupBy((x) => x.getGroup(), customResourcesDefinitions.get()),
      );

      console.log(asd);

      return [
        {
          title: "Custom Resources",
          getIcon: () => <Icon material="extension" />,
          path: "/crd",
          isActive: false,

          children: asd.map(([group, definitions]) => ({
            title: group,
            path: "asmldkaskd",
            isActive: false,

            children: definitions.map((definition) => ({
              title: definition.getResourceKind(),
              path: `asmldkaskd/${definition.getResourceUrl()}`,
              isActive: false,
              children: [],
            })),
          })),
        },
      ];

      // const parentRoute = {
      //   title: "KUKKUU",
      //   path: "/crd/:group/:name",
      //   Component: CrdResources,
      //   parent: di.inject(customResourcesRouteInjectable),
      //   clusterFrame: true,
      //   mikko: () => true,
      // };

      //   for (const [group, definitions] of customResourcesDefinitions.get()) {
      //   tabs.push({
      //     id: `crd-group:${group}`,
      //     title: group,
      //     routePath: crdURL({ query: { groups: group }}),
      //     subRoutes: definitions.map(crd => ({
      //       id: `crd-resource:${crd.getResourceApiBase()}`,
      //       title: crd.getResourceKind(),
      //       routePath: crd.getResourceUrl(),
      //     })),
      //   });
      // }

      // return [
      //   parentRoute,
      //
      //   {
      //     title: "Mikko",
      //     path: "/crda/:group/:name",
      //     Component: CrdResources,
      //     parent: parentRoute,
      //     clusterFrame: true,
      //     mikko: () => true,
      //   },
      // ];
    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default customResourceSidebarItemsInjectable;
