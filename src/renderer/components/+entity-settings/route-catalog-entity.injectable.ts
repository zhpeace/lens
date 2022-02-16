/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { catalogEntityRegistry } from "../../api/catalog-entity-registry";
import entitySettingsRouteParametersInjectable from "./entity-settings-route-parameters.injectable";

const routeCatalogEntityInjectable = getInjectable({
  id: "route-catalog-entity",

  instantiate: (di) => {
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

export default routeCatalogEntityInjectable;
