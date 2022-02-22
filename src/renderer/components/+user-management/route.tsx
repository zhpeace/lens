/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./user-management.scss";

import React from "react";
import { observer } from "mobx-react";
import { TabLayout, TabLayoutRoute } from "../layout/tab-layout";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import userManagementRouteTabsInjectable from "./route-tabs.injectable";

interface Props {
  children: React.ReactNode;
}

interface Dependencies {
  routes: IComputedValue<TabLayoutRoute[]>;
}

const NonInjectedUserManagementRoute = observer(
  ({ routes, children }: Dependencies & Props) => (
    <TabLayout className="UserManagement" tabs={routes.get()}>
      {children}
    </TabLayout>
  ),
);

export const UserManagementRoute = withInjectables<Dependencies, Props>(
  NonInjectedUserManagementRoute,
  {
    getProps: (di, props) => ({
      routes: di.inject(userManagementRouteTabsInjectable),
      ...props,
    }),
  },
);
