/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { pipeline } from "@ogre-tools/fp";


import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { fromPairs, map, toPairs } from "lodash/fp";
import { PageParam, PageParamInit } from "../navigation";
import currentRouteRegistrationInjectable from "./current-route-registration.injectable";

const currentPageParamsInjectable = getInjectable({
  id: "current-page-params",

  instantiate: (di) => {
    const observableHistory = di.inject(observableHistoryInjectable);
    const currentRouteRegistration = di.inject(currentRouteRegistrationInjectable);

    return computed(() => {
      const { extensionId, registration } = currentRouteRegistration.get();

      return pipeline(
        registration.params,
        (params) => toPairs(params),

        map(([key, value]): [string, PageParamInit] => [
          key,

          typeof value === "string"
            ? convertStringToPageParam(key, value, extensionId)
            : (value as PageParamInit),
        ]),

        map(([key, value]) => [key, new PageParam(value, observableHistory)]),

        (paramsTuple) => fromPairs(paramsTuple),
      );
    });
  },
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

export default currentPageParamsInjectable;
