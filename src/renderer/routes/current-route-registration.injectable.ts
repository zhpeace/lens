/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { pipeline } from "@ogre-tools/fp";
import type { PageRegistration } from "../../extensions/registries";
import {
  getSanitizedPath,
  sanitizeExtensionName,
} from "../../extensions/lens-extension";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import { matchPath } from "react-router";
import { find, flatMap, map } from "lodash/fp";

const currentRouteRegistrationInjectable = getInjectable({
  id: "current-route-registration",

  instantiate: (di) => {
    const observableHistory = di.inject(observableHistoryInjectable);
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed(() =>
      pipeline(
        extensions.get(),

        map((extension): [string, PageRegistration[]] => [
          sanitizeExtensionName(extension.name),
          [...extension.clusterPages, ...extension.globalPages],
        ]),

        flatMap(([extensionId, registrations]) => {
          return registrations.map((registration) => {
            const path = getSanitizedPath(
              "/extension",
              extensionId,
              registration.id,
            );

            return {
              path,
              extensionId,
              registration,
            };
          });
        }),

        find(
          (x) =>
            !!matchPath(observableHistory.location.pathname, {
              path: x.path,
              exact: true,
            }),
        ),
      ),
    );
  },
});

export default currentRouteRegistrationInjectable;
