/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { matchPath } from "react-router";
import observableHistoryInjectable from "../../navigation/observable-history.injectable";
import { entitySettingsRoute, EntitySettingsRouteParams } from "../../../common/routes";

const entitySettingsRouteParametersInjectable = getInjectable({
  id: "entity-settings-route-parameters",

  instantiate: (di) => {
    const observableHistory = di.inject(observableHistoryInjectable);

    return computed((): EntitySettingsRouteParams => {
      const match = matchPath<EntitySettingsRouteParams>(observableHistory.location.pathname, {
        path: entitySettingsRoute.path,
      });

      if (match) {
        return match.params;
      }

      return { entityId: null };
    });
  },
});

export default entitySettingsRouteParametersInjectable;
