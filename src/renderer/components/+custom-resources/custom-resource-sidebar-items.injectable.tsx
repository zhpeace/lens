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

const customResourceSidebarItemsInjectable = getInjectable({
  id: "custom-resource-sidebar-items",

  instantiate: (di) => {
    const allCrds = di.inject(
      customResourceDefinitionsInjectable,
    );

    return computed(() => {
      const groupedCrds = toPairs(
        groupBy((x) => x.getGroup(), allCrds.get()),
      );

      const rootItem = {
        id: "custom-resources",
        title: "Custom Resources",
        getIcon: () => <Icon material="extension" />,
        url: "/crd",
        isActive: false,
      };

      return [
        rootItem,

        ...groupedCrds.flatMap(([group, definitions]) => {
          const parentGroupId = `custom-resources-group-${group}`;

          const groupParent = {
            id: parentGroupId,
            parentId: "custom-resources",
            title: group,
            url: `/crd/definitions?groups=${group}`,
            isActive: false,
          };

          return [
            groupParent,

            ...definitions.map((crd) => {
              const title = crd.getResourceKind();

              return ({
                id: `${parentGroupId}-${title}`,
                parentId: parentGroupId,
                title,
                url: crd.getResourceUrl(),
                isActive: false,
              });
            }),
          ];
        }),
      ];

    });
  },

  injectionToken: sidebarItemsInjectionToken,
});

export default customResourceSidebarItemsInjectable;
