/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { DiContainer, getInjectable } from "@ogre-tools/injectable";

import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import { routeInjectionToken } from "./all-routes.injectable";
import { getExtensionRouteId } from "./get-extension-route-id";
import { getSanitizedPath } from "../../extensions/lens-extension";
import { observer } from "mobx-react";
import React from "react";
import { isEmpty, matches } from "lodash/fp";
import type { PageRegistration } from "../../extensions/registries";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import type { ObservableHistory } from "mobx-observable-history";
import { extensionRegistratorInjectionToken } from "../../extensions/extension-loader/extension-registrator-injection-token";
import { SiblingsInTabLayout } from "../components/layout/siblings-in-tab-layout";
import extensionPageParametersInjectable from "./extension-page-parameters.injectable";
import { routeSpecificComponentInjectionToken } from "./route-specific-component-injection-token";

const extensionRouteRegistratorInjectable = getInjectable({
  id: "extension-route-registrator",

  instantiate: (di: DiContainer) => {
    const observableHistory = di.inject(observableHistoryInjectable);

    return async (
      extension: LensRendererExtension,
      extensionInstallationCount: number,
    ) => {
      const toRouteInjectable = toRouteInjectableFor(
        di,
        extension,
        observableHistory,
        extensionInstallationCount,
      );

      const routeInjectables = [
        ...extension.globalPages.map(toRouteInjectable(false)),
        ...extension.clusterPages.map(toRouteInjectable(true)),
      ].flat();

      // TODO: Transactional register
      routeInjectables.forEach(di.register);

      // await Promise.all(routeInjectables.map(di.register));
    };
  },

  injectionToken: extensionRegistratorInjectionToken,
});

export default extensionRouteRegistratorInjectable;

const toRouteInjectableFor =
  (
    di: DiContainer,
    extension: LensRendererExtension,
    observableHistory: ObservableHistory,
    extensionInstallationCount: number,
  ) =>
    (clusterFrame: boolean) => {
      return (registration: PageRegistration) => {
        const routeId = getExtensionRouteId(
          extension.sanitizedExtensionId,
          registration.id,
        );

        const routePath = getSanitizedPath("/extension", routeId);

        const routeInjectable = getInjectable({
          id: `route-${routeId}-for-extension-instance-${extensionInstallationCount}`,

          instantiate: () => ({
            id: routeId,
            path: routePath,
            clusterFrame,
            isEnabled: () => true,
            extension,
          }),

          injectionToken: routeInjectionToken,
        });

        const normalizedParams = di.inject(extensionPageParametersInjectable, {
          extension,
          registration,
        });

        console.log("mikko5", normalizedParams);

        const currentSidebarRegistration = extension.clusterPageMenus.find(
          matches({ target: { pageId: registration.id }}),
        );

        const siblingRegistrations = currentSidebarRegistration?.parentId
          ? extension.clusterPageMenus.filter(
            matches({ parentId: currentSidebarRegistration.parentId }),
          )
          : [];

        console.log(siblingRegistrations);
        const ObserverPage = observer(registration.components.Page);

        const Component = () => {
          if (isEmpty(siblingRegistrations)) {
            return <ObserverPage params={normalizedParams} />;
          }

          return (
            <SiblingsInTabLayout>
              <ObserverPage params={normalizedParams} />
            </SiblingsInTabLayout>
          );
        };

        const routeSpecificComponentInjectable = getInjectable({
          id: `route-${routeId}-component-for-extension-instance-${extensionInstallationCount}`,

          instantiate: (di) => ({
            route: di.inject(routeInjectable),
            Component,
          }),

          injectionToken: routeSpecificComponentInjectionToken,
        });

        return [routeInjectable, routeSpecificComponentInjectable];
      };
    };
