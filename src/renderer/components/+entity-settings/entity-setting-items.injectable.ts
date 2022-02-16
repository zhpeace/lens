/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import {
  getInjectable,
  getInjectionToken,
} from "@ogre-tools/injectable";
import { conforms, eq, includes, isEmpty, overSome } from "lodash/fp";
import { computed } from "mobx";
import extensionEntitySettingRegistrationsInjectable
  from "./extension-entity-setting-registrations.injectable";
import type { EntitySettingRegistration } from "../../../extensions/registries";
import routeCatalogEntityInjectable from "./route-catalog-entity.injectable";

export const entitySettingRegistrationInjectionToken = getInjectionToken<EntitySettingRegistration>({ id: "entity-setting-registrations" });

const entitySettingItemsInjectable = getInjectable({
  id: "entity-setting-items",

  instantiate: (di) => {
    const extensionEntitySettingRegistrations = di.inject(extensionEntitySettingRegistrationsInjectable);
    const coreEntitySettingRegistrations = di.injectMany(entitySettingRegistrationInjectionToken);

    return computed(() => {
      const entity = di.inject(routeCatalogEntityInjectable).get();

      if (!entity) {
        return [];
      }

      const allRegistrations = [
        ...coreEntitySettingRegistrations,
        ...extensionEntitySettingRegistrations.get(),
      ];

      return allRegistrations
        .filter((registration) => {
          const checkForMatchingSource =
            registration.source && entity.metadata.source;

          return conforms({
            kind: eq(entity.kind),
            apiVersions: includes(entity.apiVersion),

            ...(checkForMatchingSource
              ? { source: overSome([isEmpty, eq(entity.metadata.source)]) }
              : {}),
          })(registration);
        })

        .map((registration) => ({
          id: registration.title.toLowerCase(),
          ...registration,
        }))

        .sort((a, b) => (b.priority ?? 50) - (a.priority ?? 50));
    });
  },

  // lifecycle: lifecycleEnum.keyedSingleton({
  //   getInstanceKey: (di, entity: CatalogEntity) =>
  //     `${entity.kind}-${entity.apiVersion}-${entity.metadata.source}`,
  // }),
});

export default entitySettingItemsInjectable;
