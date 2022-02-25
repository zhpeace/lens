/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import { pipeline } from "@ogre-tools/fp";
import type { PageRegistration } from "../../extensions/registries";
import {
  getSanitizedPath,
  sanitizeExtensionName,
} from "../../extensions/lens-extension";
import { computed } from "mobx";
import { flatMap, fromPairs, map, toPairs } from "lodash/fp";
import { PageParam, PageParamInit } from "../navigation";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { getExtensionRouteId } from "./get-extension-route-id";

const routeRegistrationsInjectable = getInjectable({
  id: "route-registrations",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);
    const observableHistory = di.inject(observableHistoryInjectable);

    return computed(() =>
      pipeline(
        extensions.get(),

        map((extension): [string, PageRegistration[]] => [
          sanitizeExtensionName(extension.name),
          [...extension.clusterPages, ...extension.globalPages],
        ]),

        flatMap(([extensionId, registrations]) => {
          return registrations.map((registration) => {
            const routeId = getExtensionRouteId(extensionId, registration.id);

            const path = getSanitizedPath("/extension", routeId);

            return {
              routeId,
              path,
              extensionId,
              registration,

              normalizedParams: pipeline(
                registration.params,
                (params) => toPairs(params),

                map(([key, value]): [string, PageParamInit] => [
                  key,

                  typeof value === "string"
                    ? convertStringToPageParam(key, value, extensionId)
                    : asdasd(key, value as PageParamInit, extensionId),
                ]),

                map(([key, value]) => [
                  key,
                  new PageParam(value, observableHistory),
                ]),

                (paramsTuple) => fromPairs(paramsTuple),
              ),
            };
          });
        }),
      ),
    );
  },
});

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

export default routeRegistrationsInjectable;
