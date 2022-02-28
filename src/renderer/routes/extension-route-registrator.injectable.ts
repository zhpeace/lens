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

const extensionRouteRegistratorInjectable = getInjectable({
  id: "extension-route-registrator",

  instantiate: (di: DiContainer) => {
    const observableHistory = di.inject(observableHistoryInjectable);

    return async (extension: LensRendererExtension, extensionInstallationCount: number) => {
      const toRouteInjectable = toRouteInjectableFor(
        extension,
        observableHistory,
        extensionInstallationCount,
      );

      const routeInjectables = [
        ...extension.globalPages.map(toRouteInjectable(false)),
        ...extension.clusterPages.map(toRouteInjectable(true)),
      ];

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
    extensionInstallationCount: number,
  ) =>
    (clusterFrame: boolean) => {
      return (registration: PageRegistration) => {
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
          id: `route-${routeId}-for-extension-instance-${extensionInstallationCount}`,

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
