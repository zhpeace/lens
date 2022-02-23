/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "./sidebar";
import observableHistoryInjectable from "../../navigation/observable-history.injectable";
import React from "react";
import rendererExtensionsInjectable from "../../../extensions/renderer-extensions.injectable";
import {
  getSanitizedPath,
  sanitizeExtensionName,
} from "../../../extensions/lens-extension";
import type { ClusterPageMenuRegistration } from "../../../extensions/registries";
import type { ObservableHistory } from "mobx-observable-history";

const extensionSidebarItemRegistrationsInjectable = getInjectable({
  id: "extension-sidebar-item-registrations",

  instantiate: (di) => {
    const observableHistory = di.inject(observableHistoryInjectable);
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed((): ISidebarItem[] => {
      return extensions
        .get()

        .flatMap((extension) =>
          extension.clusterPageMenus.map((registration) => ({
            ...registration,

            target: {
              ...registration.target,
              extensionId: sanitizeExtensionName(extension.name),
            },
          })),
        )
        .map(toSidebarItemFor(observableHistory));
    });
  },
});

export default extensionSidebarItemRegistrationsInjectable;

const toSidebarItemFor = (observableHistory: ObservableHistory<unknown>) => {
  return (registration: ClusterPageMenuRegistration): ISidebarItem => {
    const targetPath = getSanitizedPath(
      "/extension",
      registration.target.extensionId,
      registration.target.pageId,
    );

    const currentPathMatches =
      observableHistory.location.pathname === targetPath;

    return {
      id: `${registration.target.extensionId}-${registration.id}`,

      parentId: registration.parentId
        ? `${registration.target.extensionId}-${registration.parentId}`
        : null,

      title: registration.title.toString(), // TODO: MIKKO
      getIcon: () => <registration.components.Icon />,

      isActive: currentPathMatches,

      onClick: () => {
        observableHistory.push(targetPath);
      },

      isVisible: true,
      priority: 9999,
    };
  };
};
