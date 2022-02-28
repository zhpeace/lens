/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { ExtensionLoader } from "./extension-loader";
import updateExtensionsStateInjectable from "./update-extensions-state/update-extensions-state.injectable";
import createExtensionInstanceInjectable from "./create-extension-instance/create-extension-instance.injectable";
import { extensionRegistratorInjectionToken } from "./extension-registrator-injection-token";

const extensionLoaderInjectable = getInjectable({
  id: "extension-loader",

  instantiate: (di) =>
    new ExtensionLoader({
      updateExtensionsState: di.inject(updateExtensionsStateInjectable),
      createExtensionInstance: di.inject(createExtensionInstanceInjectable),
      extensionRegistrators: di.injectMany(extensionRegistratorInjectionToken),
    }),
});

export default extensionLoaderInjectable;
