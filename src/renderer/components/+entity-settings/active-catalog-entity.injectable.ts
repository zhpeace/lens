/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { catalogEntityRegistry } from "../../api/catalog-entity-registry";
import entitySettingsRouteParametersInjectable from "./entity-settings-route-parameters.injectable";

const activeCatalogEntityInjectable = getInjectable({
  id: "active-catalog-entity",

  instantiate: (di) => {
    // TODO: Make it work on all routes
    const entitySettingsRouteParameters = di.inject(entitySettingsRouteParametersInjectable);

    return computed(() => {
      const { entityId } = entitySettingsRouteParameters.get();

      // Note: Currently entity ID is present in route parameters only in root-frame
      if (entityId) {
        return catalogEntityRegistry.getById(entityId);
      }

      return catalogEntityRegistry.activeEntity;
    });
  },
});

export default activeCatalogEntityInjectable;
