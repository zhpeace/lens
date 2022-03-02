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
import { flatMap, map } from "lodash/fp";
import { getExtensionRouteId } from "./get-extension-route-id";

const routeRegistrationsInjectable = getInjectable({
  id: "route-registrations",

  instantiate: (di) => {
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
            const routeId = getExtensionRouteId(extensionId, registration.id);

            const path = getSanitizedPath("/extension", routeId);

            return {
              routeId,
              path,
              extensionId,
              registration,
            };
          });
        }),
      ),
    );
  },
});

export default routeRegistrationsInjectable;
