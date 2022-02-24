/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { withInjectables } from "@ogre-tools/injectable-react";
import type { IComputedValue } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import extensionPageInjectable from "./extension-page.injectable";
import type { PageParams } from "../../extensions/registries";

interface Dependencies {
  asd: IComputedValue<{ Component: React.ComponentType<any>; pageParams: PageParams }>;
}

const NonInjectedExtensionPageForRootFrame = observer(
  ({ asd }: Dependencies) => {
    const { Component, pageParams } = asd.get();

    return <Component params={pageParams} />;
  },
);

export const ExtensionPageForRootFrame = withInjectables<Dependencies>(
  NonInjectedExtensionPageForRootFrame,

  {
    getProps: (di) => ({
      asd: di.inject(extensionPageInjectable),
    }),
  },
);
