/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { withInjectables } from "@ogre-tools/injectable-react";
import type { IComputedValue } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import extensionPageComponentInjectable from "./extension-page-component.injectable";
import { SiblingsInTabLayout } from "../components/layout/siblings-in-tab-layout";

interface Dependencies {
  Component: IComputedValue<React.ComponentType<any>>;
}

const NonInjectedExtensionPage = observer(({ Component }: Dependencies) => {
  const DereferencedComponent = Component.get();

  return (
    <SiblingsInTabLayout>
      <DereferencedComponent />
    </SiblingsInTabLayout>
  );
});

export const ExtensionPage = withInjectables<Dependencies>(
  NonInjectedExtensionPage,

  {
    getProps: (di) => ({
      Component: di.inject(extensionPageComponentInjectable),
    }),
  },
);
