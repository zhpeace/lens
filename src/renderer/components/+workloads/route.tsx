/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./workloads.scss";

import React from "react";
import { TabLayout } from "../layout/tab-layout";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import type { ISidebarItem } from "../layout/sidebar";
import siblingTabsInjectable from "../../routes/sibling-tabs.injectable";

export interface WorkloadsRouteProps {
  children: React.ReactNode;
}

interface Dependencies {
  tabs: IComputedValue<ISidebarItem[]>;
}

const NonInjectedWorkloadsRoute = observer(
  ({ tabs, children }: Dependencies & WorkloadsRouteProps) => (
    <TabLayout className="Workloads" newTabs={tabs.get()}>
      {children}
    </TabLayout>
  ),
);

export const WorkloadsRoute = withInjectables<
  Dependencies,
  WorkloadsRouteProps
>(NonInjectedWorkloadsRoute, {
  getProps: (di, props) => ({
    tabs: di.inject(siblingTabsInjectable),
    ...props,
  }),
});
