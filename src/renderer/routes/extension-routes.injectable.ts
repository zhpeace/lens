/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sanitizeExtensionName } from "../../extensions/lens-extension";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import type { Route } from "./all-routes.injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";

const extensionRoutesInjectable = getInjectable({
  id: "extension-routes",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed((): Route[] => [...extensions.get().flatMap(toGlobalRoutes), ...extensions.get().flatMap(toClusterFrameRoutes)]);
  },
});

export default extensionRoutesInjectable;

const toGlobalRoutes = (extension: LensRendererExtension) =>
  extension.globalPages.map((registration) => {
    const extensionId = sanitizeExtensionName(extension.name);

    const pagePath = [
      "/extension",
      extensionId,
      registration.id,
    ]
      .filter(Boolean)
      .join("/")
      .replace(/\/+/g, "/")
      .replace(/\/$/, ""); // normalize multi-slashes (e.g. coming from page.id)

    return {
      path: pagePath,
      Component: registration.components.Page,
      clusterFrame: false,
      isEnabled: () => true,
      id: `${extensionId}-${registration.id}`,
    };
  });

const toClusterFrameRoutes = (extension: LensRendererExtension) =>
  extension.clusterPages.map((registration) => {
    const extensionId = sanitizeExtensionName(extension.name);

    const pagePath = [
      "/extension",
      extensionId,
      registration.id,
    ]
      .filter(Boolean)
      .join("/")
      .replace(/\/+/g, "/")
      .replace(/\/$/, ""); // normalize multi-slashes (e.g. coming from page.id)

    return {
      path: pagePath,
      Component: registration.components.Page,
      clusterFrame: true,
      isEnabled: () => true,
      id: `${extensionId}-${registration.id}`,
    };
  });
