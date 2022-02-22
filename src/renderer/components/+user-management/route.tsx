/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./user-management.scss";

import React from "react";
import { observer } from "mobx-react";
import { TabLayout } from "../layout/tab-layout";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { ISidebarItem } from "../layout/sidebar";
import userManagementChildSidebarItemsInjectable
  from "./user-management-child-sidebar-items.injectable";

interface Props {
  children: React.ReactNode;
}

interface Dependencies {
  tabs: IComputedValue<ISidebarItem[]>;
}

const NonInjectedUserManagementRoute = observer(
  ({ tabs, children }: Dependencies & Props) => (
    <TabLayout className="UserManagement" newTabs={tabs.get()}>
      {children}
    </TabLayout>
  ),
);

export const UserManagementRoute = withInjectables<Dependencies, Props>(
  NonInjectedUserManagementRoute,
  {
    getProps: (di, props) => ({
      tabs: di.inject(userManagementChildSidebarItemsInjectable),
      ...props,
    }),
  },
);
