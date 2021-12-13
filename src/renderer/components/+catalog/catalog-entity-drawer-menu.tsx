/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import { cssNames } from "../../utils";
import type { MenuActionsProps } from "../menu/menu-actions";
import { MenuActions } from "../menu/menu-actions";
import type { CatalogEntity, CatalogEntityContextMenuContext } from "../../api/catalog-entity";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { HotbarToggleMenuItem } from "./hotbar-toggle-menu-item";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { Navigate } from "../../navigation/navigate.injectable";
import navigateInjectable from "../../navigation/navigate.injectable";
import type { NormalizeCatalogEntityContextMenu } from "../../catalog/normalize-menu-item.injectable";
import normalizeCatalogEntityContextMenuInjectable from "../../catalog/normalize-menu-item.injectable";

export interface CatalogEntityDrawerMenuProps extends MenuActionsProps {
  entity: CatalogEntity | null | undefined;
}

interface Dependencies {
  normalizeMenuItem: NormalizeCatalogEntityContextMenu;
  navigate: Navigate;
}

@observer
class NonInjectedCatalogEntityDrawerMenu extends React.Component<CatalogEntityDrawerMenuProps & Dependencies> {
  @observable private contextMenu: CatalogEntityContextMenuContext;

  constructor(props: CatalogEntityDrawerMenuProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.contextMenu = {
      menuItems: [],
      navigate: this.props.navigate,
    };
    this.props.entity?.onContextMenuOpen(this.contextMenu);
  }

  getMenuItems(entity: CatalogEntity | null | undefined): React.ReactChild[] {
    if (!entity) {
      return [];
    }

    const items = this.contextMenu.menuItems
      .filter(menuItem => menuItem.icon)
      .map(this.props.normalizeMenuItem)
      .map(menuItem => (
        <MenuItem key={menuItem.title} onClick={menuItem.onClick}>
          <Icon
            interactive
            tooltip={menuItem.title}
            {...{ [Icon.isSvg(menuItem.icon) ? "svg" : "material"]: menuItem.icon }}
          />
        </MenuItem>
      ));

    items.push(
      <HotbarToggleMenuItem
        key="hotbar-toggle"
        entity={entity}
        addContent={<Icon material="push_pin" interactive small tooltip="Add to Hotbar"/>}
        removeContent={<Icon svg="push_off" interactive small tooltip="Remove from Hotbar"/>}
      />,
    );

    return items;
  }

  render() {
    const { className, entity, ...menuProps } = this.props;

    if (!this.contextMenu || !entity.isEnabled()) {
      return null;
    }

    return (
      <MenuActions
        className={cssNames("CatalogEntityDrawerMenu", className)}
        toolbar
        {...menuProps}
      >
        {this.getMenuItems(entity)}
      </MenuActions>
    );
  }
}

export const CatalogEntityDrawerMenu = withInjectables<Dependencies, CatalogEntityDrawerMenuProps>(NonInjectedCatalogEntityDrawerMenu, {
  getProps: (di, props) => ({
    ...props,
    normalizeMenuItem: di.inject(normalizeCatalogEntityContextMenuInjectable),
    navigate: di.inject(navigateInjectable),
  }),
});
