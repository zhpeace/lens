/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./sidebar.module.scss";

import React from "react";
import { observer } from "mobx-react";
import { cssNames } from "../../utils";
import { SidebarItemProps, SidebarItem } from "./sidebar-item";
import { catalogEntityRegistry } from "../../api/catalog-entity-registry";
import { SidebarCluster } from "./sidebar-cluster";
import { withInjectables } from "@ogre-tools/injectable-react";
import sidebarItemsInjectable from "./sidebar-items.injectable";
import type { IComputedValue } from "mobx";
import { matches } from "lodash/fp";

interface Dependencies {
  sidebarItems: IComputedValue<SidebarItemProps[]>
}

@observer
class NonInjectedSidebar extends React.Component<Dependencies> {
  static displayName = "Sidebar";

  get clusterEntity() {
    return catalogEntityRegistry.activeEntity;
  }

  render() {
    return (
      <div className={cssNames("flex flex-col")} data-testid="cluster-sidebar">
        <SidebarCluster clusterEntity={this.clusterEntity} />
        <div className={styles.sidebarNav}>
          {renderSidebarItems(this.props.sidebarItems.get())}
        </div>
      </div>
    );
  }
}

export const Sidebar = withInjectables<Dependencies>(
  NonInjectedSidebar,

  {
    getProps: (di, props) => ({
      sidebarItems: di.inject(sidebarItemsInjectable),
      ...props,
    }),
  },
);

const renderSidebarItems = (sidebarItems: SidebarItemProps[]) => {
  const _renderSiderbarItem = (sidebarItem: SidebarItemProps) => (
    <SidebarItem
      key={sidebarItem.id}
      {...sidebarItem}
    >
      {sidebarItems.filter(matches({ parentId: sidebarItem.id })).map(_renderSiderbarItem)}
    </SidebarItem>
  );

  return sidebarItems.filter(matches({ parentId: null })).map(_renderSiderbarItem);
};
