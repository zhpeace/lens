/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { matchPath } from "react-router";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import {
  getSanitizedPath,
  sanitizeExtensionName,
} from "../../extensions/lens-extension";

const extensionPageComponentInjectable = getInjectable({
  id: "extension-page-component",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);
    const observableHistory = di.inject(observableHistoryInjectable);

    return computed(() => {
      const clusterPageRegistrations = extensions.get().flatMap((extension) =>
        extension.clusterPages.map((registration) => {
          const extensionId = sanitizeExtensionName(extension.name);

          return {
            path: getSanitizedPath("/extension", extensionId, registration.id),
            registration,
          };
        }),
      );

      const { registration } = clusterPageRegistrations.find(({ path }) =>
        matchPath(observableHistory.location.pathname, { path }),
      );

      return registration.components.Page;
    });
  },
});

export default extensionPageComponentInjectable;
