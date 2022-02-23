/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./storage.scss";

import React from "react";
import { observer } from "mobx-react";
import { TabLayout } from "../layout/tab-layout";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { ISidebarItem } from "../layout/sidebar";
import siblingTabsInjectable from "../../routes/sibling-tabs.injectable";

export interface StorageRouteProps {
  children: React.ReactNode;
}

interface Dependencies {
  tabs: IComputedValue<ISidebarItem[]>;
}

const NonInjectedStorageRoute = observer(
  ({ tabs, children }: Dependencies & StorageRouteProps) => (
    <TabLayout className="Storage" newTabs={tabs.get()}>
      {children}
    </TabLayout>
  ),
);

export const StorageRoute = withInjectables<Dependencies, StorageRouteProps>(
  NonInjectedStorageRoute,
  {
    getProps: (di, props) => ({
      tabs: di.inject(siblingTabsInjectable),
      ...props,
    }),
  },
);
