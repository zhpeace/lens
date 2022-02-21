/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { sanitizeExtensionName } from "../../extensions/lens-extension";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";

const extensionRoutesInjectable = getInjectable({
  id: "extension-routes",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed(() =>
      extensions.get().flatMap((extension) =>
        extension.globalPages.map((registration) => {
          const pagePath = [
            "/extension",
            sanitizeExtensionName(extension.name),
            registration.id,
          ]
            .filter(Boolean)
            .join("/")
            .replace(/\/+/g, "/")
            .replace(/\/$/, ""); // normalize multi-slashes (e.g. coming from page.id)

          return {
            path: pagePath,
            Component: registration.components.Page,
          };
        }),
      ),
    );
  },
});

export default extensionRoutesInjectable;
