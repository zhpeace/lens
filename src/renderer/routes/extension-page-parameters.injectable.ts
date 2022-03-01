/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { pipeline } from "@ogre-tools/fp";
import { PageParam, PageParamInit } from "../navigation";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import type { PageRegistration } from "../../extensions/registries";
import { fromPairs, map, toPairs } from "lodash/fp";

interface InstantiationParameter {
  extension: LensRendererExtension;
  registration: PageRegistration;
}

const extensionPageParametersInjectable = getInjectable({
  id: "extension-page-parameters",

  instantiate: (di, { extension, registration }: InstantiationParameter) => {
    const observableHistory = di.inject(observableHistoryInjectable);

    return pipeline(
      registration.params,
      (params) => toPairs(params),

      map(([key, value]): [string, PageParamInit] => [
        key,

        typeof value === "string"
          ? convertStringToPageParam(key, value, extension.sanitizedExtensionId)
          : asdasd(key, value as PageParamInit, extension.sanitizedExtensionId),
      ]),

      map(([key, value]) => [key, new PageParam(value, observableHistory)]),

      (paramsTuple) => fromPairs(paramsTuple),
    );
  },

  lifecycle: lifecycleEnum.keyedSingleton({
    getInstanceKey: (
      di,
      { extension, registration }: InstantiationParameter,
    ) => `${extension.sanitizedExtensionId}-${registration.id}`,
  }),
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

export default extensionPageParametersInjectable;
