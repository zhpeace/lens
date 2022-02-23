/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { withInjectables } from "@ogre-tools/injectable-react";
import type { IComputedValue } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import type { ISidebarItem } from "../components/layout/sidebar";
import siblingTabsInjectable from "./sibling-tabs.injectable";
import { TabLayout } from "../components/layout/tab-layout";
import extensionPageComponentInjectable from "./extension-page-component.injectable";

interface Dependencies {
  tabs: IComputedValue<ISidebarItem[]>;
  Component: IComputedValue<React.ComponentType<any>>;
}

const NonInjectedExtensionPage = observer(
  ({ tabs, Component }: Dependencies) => {
    const dereferencedTabs = tabs.get();
    const DereferencedComponent = Component.get();

    if (dereferencedTabs.length) {
      return (
        <TabLayout newTabs={dereferencedTabs}>
          <DereferencedComponent />
        </TabLayout>
      );
    }

    return <DereferencedComponent />;
  },
);

export const ExtensionPage = withInjectables<Dependencies>(
  NonInjectedExtensionPage,

  {
    getProps: (di) => ({
      tabs: di.inject(siblingTabsInjectable),
      Component: di.inject(extensionPageComponentInjectable),
    }),
  },
);
