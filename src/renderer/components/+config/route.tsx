/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import { observer } from "mobx-react";
import { TabLayout } from "../layout/tab-layout";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { ISidebarItem } from "../layout/sidebar";
import configChildSidebarItemsInjectable from "./config-child-sidebar-items.injectable";

export interface ConfigRouteProps {
  children: React.ReactNode;
}

interface Dependencies {
  tabs: IComputedValue<ISidebarItem[]>;
}

const NonInjectedConfigRoute = observer(
  ({ tabs, children }: Dependencies & ConfigRouteProps) => (
    <TabLayout className="Config" newTabs={tabs.get()}>
      {children}
    </TabLayout>
  ),
);

export const ConfigRoute = withInjectables<Dependencies, ConfigRouteProps>(
  NonInjectedConfigRoute,
  {
    getProps: (di, props) => ({
      tabs: di.inject(configChildSidebarItemsInjectable),
      ...props,
    }),
  },
);
