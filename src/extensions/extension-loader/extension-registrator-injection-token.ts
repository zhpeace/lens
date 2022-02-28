/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectionToken } from "@ogre-tools/injectable";
import type { LensExtension } from "../lens-extension";

export const extensionRegistratorInjectionToken = getInjectionToken<ExtensionRegistrator>({
  id: "extension-registrator-token",
});

export interface ExtensionRegistrator {
  onEnable: (extension: LensExtension) => Promise<void>
  onDisable: (extension: LensExtension) => void
}
