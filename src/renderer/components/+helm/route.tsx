/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import { observer } from "mobx-react";
import { TabLayout } from "../layout/tab-layout";

export interface HelmRouteProps {
  children: React.ReactNode;
}

export const HelmRoute = observer(
  ({ children }: HelmRouteProps) => (
    <TabLayout
      className="Apps"
      newTabs={[
        { title: "Charts", path: "/helm/charts" },
        { title: "Releases", path: "/helm/releases" },
      ]}
    >
      {children}
    </TabLayout>
  ),
);
