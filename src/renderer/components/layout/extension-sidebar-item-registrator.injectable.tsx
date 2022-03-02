/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { DiContainer, getInjectable } from "@ogre-tools/injectable";
import type { LensRendererExtension } from "../../../extensions/lens-renderer-extension";
import React from "react";
import { extensionRegistratorInjectionToken } from "../../../extensions/extension-loader/extension-registrator-injection-token";
import {
  SidebarItemRegistration,
  sidebarItemsInjectionToken,
} from "./sidebar-items.injectable";
import { computed } from "mobx";
import navigateToRouteInjectable from "../../routes/navigate-to-route.injectable";
import routesInjectable from "../../routes/routes.injectable";
import { matches, noop } from "lodash/fp";
import routeIsActiveInjectable from "../../routes/route-is-active.injectable";

const extensionSidebarItemRegistratorInjectable = getInjectable({
  id: "extension-sidebar-item-registrator",

  instantiate:
    (di: DiContainer) =>
      async (
        extension: LensRendererExtension,
        extensionInstallationCount: number,
      ) => {
        const sidebarItemsForExtensionInjectable = getInjectable({
          id: `sidebar-items-for-extension-${extension.sanitizedExtensionId}-instance-${extensionInstallationCount}`,
          injectionToken: sidebarItemsInjectionToken,

          instantiate: (di) => {
            const navigateToRoute = di.inject(navigateToRouteInjectable);
            const routes = di.inject(routesInjectable);

            return computed((): SidebarItemRegistration[] => {
              const extensionRoutes = routes.get().filter(matches({ extension }));

              return extension.clusterPageMenus.map((registration) => {
                const targetRouteId = registration.target?.pageId
                  ? `${extension.sanitizedExtensionId}/${registration.target.pageId}`
                  : extension.sanitizedExtensionId;

                const targetRoute = extensionRoutes.find(
                  matches({ id: targetRouteId }),
                );

                const asd = targetRoute
                  ? {
                    onClick: () => navigateToRoute(targetRoute),
                    isActive: di.inject(routeIsActiveInjectable, targetRoute),
                  }
                  : { onClick: noop };

                return {
                  id: `${extension.sanitizedExtensionId}-${registration.id}`,
                  extension,

                  parentId: registration.parentId
                    ? `${extension.sanitizedExtensionId}-${registration.parentId}`
                    : null,

                  title: registration.title.toString(),
                  getIcon: registration.components.Icon
                    ? () => <registration.components.Icon />
                    : null,

                  ...asd,

                  priority: 9999,
                };
              });
            });
          },
        });

        // TODO: Transactional register
        di.register(sidebarItemsForExtensionInjectable);
      },

  injectionToken: extensionRegistratorInjectionToken,
});

export default extensionSidebarItemRegistratorInjectable;
