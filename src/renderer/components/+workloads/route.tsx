/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./workloads.scss";

import React from "react";
import { TabLayout, TabLayoutRoute } from "../layout/tab-layout";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import workloadsRouteTabsInjectable from "./route-tabs.injectable";

export interface WorkloadsRouteProps {
  children: React.ReactNode;
}

interface Dependencies {
  routes: IComputedValue<TabLayoutRoute[]>;
}

const NonInjectedWorkloadsRoute = observer(
  ({ routes, children }: Dependencies & WorkloadsRouteProps) => (
    <TabLayout className="Workloads" tabs={routes.get()}>
      {children}
    </TabLayout>
  ),
);

export const WorkloadsRoute = withInjectables<
  Dependencies,
  WorkloadsRouteProps
>(NonInjectedWorkloadsRoute, {
  getProps: (di, props) => ({
    routes: di.inject(workloadsRouteTabsInjectable),
    ...props,
  }),
});
