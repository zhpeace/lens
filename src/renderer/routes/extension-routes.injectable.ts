/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { getSanitizedPath, sanitizeExtensionName } from "../../extensions/lens-extension";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import type { Route } from "./all-routes.injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import type { PageRegistration } from "../../extensions/registries";
import { ExtensionPage } from "./extension-page";
import { getExtensionRouteId } from "./get-extension-route-id";

const extensionRoutesInjectable = getInjectable({
  id: "extension-routes",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed((): Route[] => [
      ...extensions
        .get()
        .flatMap((extension) => [
          ...extension.globalPages.map(toGlobalRouteFor(extension)),
          ...extension.clusterPages.map(toClusterFrameRouteFor(extension)),
        ]),
    ]);
  },
});

export default extensionRoutesInjectable;

const toGlobalRouteFor =
  (extension: LensRendererExtension) =>
    (registration: PageRegistration): Route => {
      const extensionId = sanitizeExtensionName(extension.name);
      const routeId = getExtensionRouteId(extensionId, registration.id);
      const pagePath = getSanitizedPath("/extension", routeId);

      return {
        id: routeId,
        path: pagePath,
        Component: ExtensionPage,
        clusterFrame: false,
        isEnabled: () => true,
        exact: true,
      };
    };

const toClusterFrameRouteFor =
  (extension: LensRendererExtension) =>
    (registration: PageRegistration): Route => {
      const extensionId = sanitizeExtensionName(extension.name);
      const routeId = getExtensionRouteId(extensionId, registration.id);
      const pagePath = getSanitizedPath("/extension", routeId);

      return {
        id: routeId,
        path: pagePath,
        Component: ExtensionPage,
        clusterFrame: true,
        isEnabled: () => true,
        exact: true,
      };
    };
