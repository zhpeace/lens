/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import crdListRouteInjectable from "./crd-list-route.injectable";
import { getUrl } from "../../routes/get-url";
import customResourceDefinitionsInjectable from "./custom-resources.injectable";
import { groupBy, matches, some, toPairs } from "lodash/fp";
import customResourcesRouteInjectable from "./custom-resources-route.injectable";
import pathParametersInjectable from "../../routes/path-parameters.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";

const sidebarItemsForDefinitionGroupsInjectable = getInjectable({
  id: "sidebar-items-for-definition-groups",

  instantiate: (di) => {
    const customResourceDefinitions = di.inject(
      customResourceDefinitionsInjectable,
    );

    const crdRoute = di.inject(customResourcesRouteInjectable);
    const crdListRoute = di.inject(crdListRouteInjectable);
    const pathParameters = di.inject(pathParametersInjectable);
    const currentRoute = di.inject(currentRouteInjectable);

    return computed(() => {
      const definitions = customResourceDefinitions.get();
      const route = currentRoute.get();
      const currentPathParameters = pathParameters.get();

      const groupedCrds = toPairs(
        groupBy((crd) => crd.getGroup(), definitions),
      );

      return groupedCrds.flatMap(([group, definitions]) => {
        const childItems = definitions.map((crd) => {
          const title = crd.getResourceKind();

          const crdPathParameters = {
            group: crd.getGroup(),
            name: crd.getPluralName(),
          };

          const definitionIsShown =
            route === crdRoute &&
            matches(crdPathParameters, currentPathParameters);

          return {
            title,

            url: getUrl(crdRoute, {
              path: crdPathParameters,
            }),

            isActive: definitionIsShown,
            isVisible: crdListRoute.mikko(),
          };
        });

        return [
          {
            title: group,
            url: getUrl(crdListRoute, { query: { groups: group }}),
            isActive: false,
            isVisible: some({ isVisible: true }, childItems),

            children: childItems,
          },
        ];
      });
    });
  },
});

export default sidebarItemsForDefinitionGroupsInjectable;
