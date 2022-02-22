/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "./sidebar";
import rendererExtensionsInjectable from "../../../extensions/renderer-extensions.injectable";
import React from "react";
import allRoutesInjectable from "../../routes/all-routes.injectable";
import { matches } from "lodash/fp";
import { sanitizeExtensionName } from "../../../extensions/lens-extension";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import type { ClusterPageMenuRegistration } from "../../../extensions/registries";

const extensionSidebarItemRegistrationsInjectable = getInjectable({
  id: "extension-sidebar-item-registrations",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);
    const allRoutes = di.inject(allRoutesInjectable);
    const navigateToRoute = di.inject(navigateToRouteInjectable);
    const route = di.inject(currentRouteInjectable);

    return computed((): ISidebarItem[] => {
      const routes = allRoutes.get();
      const currentRoute = route.get();

      return extensions.get().flatMap((extension) => {
        const extensionId = sanitizeExtensionName(extension.name);

        const registrationsForExtension = extension.clusterPageMenus
          .map(({ target = {}, ...registration }) => ({
            ...registration,
            target: { ...target, extensionId },
          }));

        const toSidebarItem = (
          registration: ClusterPageMenuRegistration,
        ): ISidebarItem => {
          const targetRoute = routes.find(
            matches({ id: `${extensionId}-${registration.target.pageId}` }),
          );

          const childItems = registrationsForExtension.filter(matches({ parentId: registration.id }));

          return {
            title: registration.title.toString(),
            getIcon: () => <registration.components.Icon />,
            isActive: currentRoute === targetRoute,
            onClick: () => navigateToRoute(targetRoute),
            isVisible: true,
            priority: 9999,
            children: registration.id
              ? childItems.map(toSidebarItem)
              : [],
          };
        };

        const rootItems = registrationsForExtension.filter(x => !x.parentId);

        return rootItems.map(toSidebarItem);
      });
    });
  },
});

export default extensionSidebarItemRegistrationsInjectable;
