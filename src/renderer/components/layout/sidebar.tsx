/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./sidebar.module.scss";
import type { TabLayoutRoute } from "./tab-layout";

import React from "react";
import { observer } from "mobx-react";
import { cssNames } from "../../utils";
import { isActiveRoute } from "../../navigation";
import { ClusterPageMenuRegistration, ClusterPageMenuRegistry, ClusterPageRegistry, getExtensionPageUrl } from "../../../extensions/registries";
import { SidebarItem } from "./sidebar-item";
import { catalogEntityRegistry } from "../../api/catalog-entity-registry";
import { SidebarCluster } from "./sidebar-cluster";
import { renderTabRoutesSidebarItems } from "./tab-routes-sidebar-items";
import { withInjectables } from "@ogre-tools/injectable-react";
import sidebarItemsInjectable from "./sidebar-items.injectable";
import type { IComputedValue } from "mobx";
import { matches } from "lodash/fp";

export interface ISidebarItem {
  title: string;
  onClick: () => void;
  getIcon?: () => React.ReactNode
  isActive: boolean
  isVisible: boolean
  children?: ISidebarItem[]
}

interface Dependencies {
  sidebarItems: IComputedValue<ISidebarItem[]>
}

@observer
class NonInjectedSidebar extends React.Component<Dependencies> {
  static displayName = "Sidebar";

  getTabLayoutRoutes(menu: ClusterPageMenuRegistration): TabLayoutRoute[] {
    if (!menu.id) {
      return [];
    }

    const routes: TabLayoutRoute[] = [];
    const subMenus = ClusterPageMenuRegistry.getInstance().getSubItems(menu);
    const clusterPageRegistry = ClusterPageRegistry.getInstance();

    for (const subMenu of subMenus) {
      const page = clusterPageRegistry.getByPageTarget(subMenu.target);

      if (!page) {
        continue;
      }

      const { extensionId, id: pageId, url, components } = page;

      if (subMenu.components.Icon) {
        console.warn(
          "ClusterPageMenuRegistration has components.Icon defined and a valid parentId. Icon will not be displayed",
          {
            id: subMenu.id,
            parentId: subMenu.parentId,
            target: subMenu.target,
          },
        );
      }

      routes.push({
        routePath: url,
        url: getExtensionPageUrl({ extensionId, pageId, params: subMenu.target.params }),
        title: subMenu.title,
        component: components.Page,
      });
    }

    return routes;
  }

  renderRegisteredMenus() {
    return ClusterPageMenuRegistry.getInstance().getRootItems().map((menuItem, index) => {
      const registeredPage = ClusterPageRegistry.getInstance().getByPageTarget(menuItem.target);
      const tabRoutes = this.getTabLayoutRoutes(menuItem);
      const id = `registered-item-${index}`;
      let pageUrl: string;
      let isActive = false;

      if (registeredPage) {
        const { extensionId, id: pageId } = registeredPage;

        pageUrl = getExtensionPageUrl({ extensionId, pageId, params: menuItem.target.params });
        isActive = isActiveRoute(registeredPage.url);
      } else if (tabRoutes.length > 0) {
        pageUrl = tabRoutes[0].url;
        isActive = isActiveRoute(tabRoutes.map((tab) => tab.routePath));
      } else {
        return null;
      }

      return (
        <SidebarItem
          key={id}
          id={id}
          url={pageUrl}
          isActive={isActive}
          text={menuItem.title}
          icon={<menuItem.components.Icon/>}
        >
          {renderTabRoutesSidebarItems(tabRoutes)}
        </SidebarItem>
      );
    });
  }

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

const renderSidebarItems = (sidebarItems: ISidebarItem[]) => {
  const _renderSiderbarItem = ({ children = [], getIcon, isActive, title, onClick }: ISidebarItem, index: number) => (
    <SidebarItem
      key={`${title}-${index}`}
      id={title}
      onClick={onClick}
      isActive={isActive}
      icon={getIcon ? getIcon() : null}
      text={title}
    >
      {renderSidebarItems(children)}
    </SidebarItem>
  );

  return sidebarItems.filter(matches({ isVisible: true })).map(_renderSiderbarItem);
};
