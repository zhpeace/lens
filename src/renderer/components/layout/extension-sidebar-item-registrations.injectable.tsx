/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { ISidebarItem } from "./sidebar";
import observableHistoryInjectable from "../../navigation/observable-history.injectable";
import { matches, some } from "lodash/fp";
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
      const registrations = extensions
        .get()

        .flatMap((extension) =>
          extension.clusterPageMenus.map((registration) => ({
            ...registration,

            target: {
              ...registration.target,
              extensionId: sanitizeExtensionName(extension.name),
            },
          })),
        );

      const rootItems = registrations.filter((x) => !x.parentId);

      const toSidebarItem = toSidebarItemFor(registrations, observableHistory);

      return rootItems.map(toSidebarItem);
    });
  },
});

export default extensionSidebarItemRegistrationsInjectable;

const toSidebarItemFor = (
  registrations: ClusterPageMenuRegistration[],
  observableHistory: ObservableHistory<unknown>,
) => {
  const toSidebarItem = (
    registration: ClusterPageMenuRegistration,
  ): ISidebarItem => {
    const targetPath = getSanitizedPath(
      "/extension",
      registration.target.extensionId,
      registration.target.pageId,
    );

    const children = registration.id
      ? registrations
        .filter(matches({ parentId: registration.id }))
        .map(toSidebarItem)
      : [];

    const childrenIsActive = some(matches({ isActive: true }), children);
    const currentPathMatches =
      observableHistory.location.pathname === targetPath;

    return {
      title: registration.title.toString(), // TODO: MIKKO
      getIcon: () => <registration.components.Icon />,
      isActive: childrenIsActive || currentPathMatches,

      onClick: () => {
        observableHistory.push(targetPath);
      },

      isVisible: true,
      priority: 9999,
      children,
    };
  };

  return toSidebarItem;
};
