/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import { observer } from "mobx-react";
import { TabLayout } from "../layout/tab-layout";
import type { ISidebarItem } from "../layout/sidebar";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import siblingTabsInjectable from "../../routes/sibling-tabs.injectable";

interface Props {
  children: React.ReactNode;
}

interface Dependencies {
  sidebarItems: IComputedValue<ISidebarItem[]>
}

const NonInjectedHelmRoute = observer(
  ({ children, sidebarItems }: Dependencies & Props) => (
    <TabLayout
      className="Apps"
      newTabs={sidebarItems.get()}
    >
      {children}
    </TabLayout>
  ),
);

export const HelmRoute = withInjectables<Dependencies, Props>(
  NonInjectedHelmRoute,

  {
    getProps: (di, props) => ({
      sidebarItems: di.inject(siblingTabsInjectable),
      ...props,
    }),
  },
);

