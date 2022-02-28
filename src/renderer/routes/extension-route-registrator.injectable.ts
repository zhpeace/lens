/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import {
  DiContainer,
  getInjectable,
} from "@ogre-tools/injectable";

import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import {
  routeInjectionToken,
} from "./all-routes.injectable";
import { getExtensionRouteId } from "./get-extension-route-id";
import {
  getSanitizedPath,
  sanitizeExtensionName,
} from "../../extensions/lens-extension";
import { observer } from "mobx-react";
import React from "react";
import { fromPairs, isEmpty, map, toPairs } from "lodash/fp";
import { pipeline } from "@ogre-tools/fp";
import { PageParam, PageParamInit } from "../navigation";
import type { PageParams, PageRegistration } from "../../extensions/registries";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import type { ObservableHistory } from "mobx-observable-history";
import {
  extensionRegistratorInjectionToken,
} from "../../extensions/extension-loader/extension-registrator-injection-token";

const extensionRouteRegistratorInjectable = getInjectable({
  id: "extension-route-registrator",

  instantiate: (di: DiContainer) => {
    // @ts-ignore
    // const routes = di.inject(allRoutesInjectable);
    const observableHistory = di.inject(observableHistoryInjectable);


    return {
      onEnable: async (extension: LensRendererExtension) => {
        const toRouteInjectable = toRouteInjectableFor(extension, observableHistory);

        const routeInjectables = [
          ...extension.globalPages.map(toRouteInjectable(false)),
          ...extension.clusterPages.map(toRouteInjectable(true)),
        ];

        routeInjectables.forEach(di.register);

        // await Promise.all(routeInjectables.map(di.register));

        // routes.invalidate();
      },

      onDisable: (extension: LensRendererExtension) => {
        const extensionId = sanitizeExtensionName(extension.name);

        const routeInjectableIds = [...extension.globalPages, ...extension.clusterPages].map(registration =>`route-${getExtensionRouteId(extensionId, registration.id)}`);

        // @ts-ignore
        routeInjectableIds.forEach(di.deregister);

        // routes.invalidate();
      },
    };
  },

  injectionToken: extensionRegistratorInjectionToken,
});

export default extensionRouteRegistratorInjectable;

const toRouteInjectableFor =
  (extension: LensRendererExtension, observableHistory: ObservableHistory) =>
    (clusterFrame: boolean) => {
      const extensionId = sanitizeExtensionName(extension.name);

      return (registration: PageRegistration) => {
        const routeId = getExtensionRouteId(extensionId, registration.id);
        const routePath = getSanitizedPath("/extension", routeId);

        const normalizedParams = getNormalizedParams(
          registration.params,
          extensionId,
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
          id: `route-${routeId}`,

          instantiate: () => ({
            id: routeId,
            path: routePath,
            Component,
            clusterFrame,
            isEnabled: () => true,
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
