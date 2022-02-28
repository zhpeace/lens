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
import { fromPairs, isEmpty, map, toPairs } from "lodash/fp";
import { pipeline } from "@ogre-tools/fp";
import { PageParam, PageParamInit } from "../navigation";
import type { PageParams, PageRegistration } from "../../extensions/registries";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import type { ObservableHistory } from "mobx-observable-history";
import { extensionRegistratorInjectionToken } from "../../extensions/extension-loader/extension-registrator-injection-token";
import extensionInstallationCounterInjectable from "./extension-installation-counter.injectable";

const extensionRouteRegistratorInjectable = getInjectable({
  id: "extension-route-registrator",

  instantiate: (di: DiContainer) => {
    const observableHistory = di.inject(observableHistoryInjectable);

    const extensionInstallationCounter = di.inject(
      extensionInstallationCounterInjectable,
    );

    return async (extension: LensRendererExtension) => {
      const toRouteInjectable = toRouteInjectableFor(
        extension,
        observableHistory,
        extensionInstallationCounter,
      );

      const routeInjectables = [
        ...extension.globalPages.map(toRouteInjectable(false)),
        ...extension.clusterPages.map(toRouteInjectable(true)),
      ];

      console.log(routeInjectables);

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
    extension: LensRendererExtension,
    observableHistory: ObservableHistory,
    extensionInstallationCounter: Map<string, number>,
  ) =>
    (clusterFrame: boolean) => {
      const extensionInstallationCount =
      (extensionInstallationCounter.get(extension.sanitizedExtensionId) || 0) +
      1;

      return (registration: PageRegistration) => {
        extensionInstallationCounter.set(
          extension.sanitizedExtensionId,
          extensionInstallationCount,
        );

        const routeId = getExtensionRouteId(
          extension.sanitizedExtensionId,
          registration.id,
        );
        const routePath = getSanitizedPath("/extension", routeId);

        const normalizedParams = getNormalizedParams(
          registration.params,
          extension.sanitizedExtensionId,
          observableHistory,
        );

        const Component = isEmpty(normalizedParams)
          ? registration.components.Page
          : observer(() =>
            React.createElement(registration.components.Page, {
              params: normalizedParams,
            }),
          );

        return getInjectable({
          id: `route-${routeId}-from-extension-instance-${extensionInstallationCount}`,

          instantiate: () => ({
            id: routeId,
            path: routePath,
            Component,
            clusterFrame,
            isEnabled: () => true,
            extension,
          }),

          injectionToken: routeInjectionToken,
        });
      };
    };

const getNormalizedParams = (
  params: PageParams,
  extensionId: string,
  observableHistory: ObservableHistory,
) =>
  pipeline(
    params,
    (params) => toPairs(params),

    map(([key, value]): [string, PageParamInit] => [
      key,

      typeof value === "string"
        ? convertStringToPageParam(key, value, extensionId)
        : asdasd(key, value as PageParamInit, extensionId),
    ]),

    map(([key, value]) => [key, new PageParam(value, observableHistory)]),

    (paramsTuple) => fromPairs(paramsTuple),
  );

const asdasd = (
  key: string,
  value: PageParamInit,
  extensionId: string,
): PageParamInit => ({
  name: key,
  prefix: `${extensionId}:`,
  defaultValue: value.defaultValue,
  stringify: value.stringify,
  parse: value.parse,
});

const convertStringToPageParam = (
  key: string,
  value: string,
  extensionId: string,
): PageParamInit => ({
  name: key,
  defaultValue: value,
  prefix: `${extensionId}:`,
});
