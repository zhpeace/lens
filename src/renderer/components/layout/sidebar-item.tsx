/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./sidebar-item.scss";

import React from "react";
import { computed, makeObservable } from "mobx";
import { cssNames, StorageHelper } from "../../utils";
import { observer } from "mobx-react";
import { NavLink } from "react-router-dom";
import { Icon } from "../icon";
import { withInjectables } from "@ogre-tools/injectable-react";
import sidebarStorageInjectable, {
  SidebarStorageState,
} from "./sidebar-storage/sidebar-storage.injectable";
import type { HierarchicalSidebarItem } from "./sidebar-items.injectable";

interface Dependencies {
  sidebarStorage: StorageHelper<SidebarStorageState>;
}

export interface SidebarItemProps {
  // title?: string;
  // onClick?: () => void;
  // getIcon?: () => React.ReactNode;
  // isActive?: boolean;
  // id?: string;
  // parentId?: string | null;

  asd: HierarchicalSidebarItem;
}

@observer
class NonInjectedSidebarItem extends React.Component<
  SidebarItemProps & Dependencies
> {
  static displayName = "SidebarItem";

  constructor(props: SidebarItemProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  get id(): string {
    return this.props.asd.item.id;
  }

  @computed get expanded(): boolean {
    return Boolean(this.props.sidebarStorage.get().expanded[this.id]);
  }

  @computed get isExpandable(): boolean {
    return this.props.asd.children.length > 0;
  }

  @computed get isActive(): boolean {
    return this.props.asd.isActive.get();
  }

  toggleExpand = () => {
    this.props.sidebarStorage.merge((draft) => {
      draft.expanded[this.id] = !draft.expanded[this.id];
    });
  };

  renderSubMenu() {
    const { isExpandable, expanded } = this;

    if (!isExpandable || !expanded) {
      return null;
    }

    return (
      <ul className={cssNames("sub-menu", { active: this.isActive })}>
        {this.props.asd.children.map(x => <SidebarItem key={x.item.id} asd={x} />)}
      </ul>
    );
  }

  render() {
    return (
      <div
        className={cssNames("SidebarItem")}
        data-testid={`sidebar-item-for-${this.id}`}
        data-test-id={this.id}
        data-is-active-test={this.isActive}
      >
        <NavLink
          to={""}
          isActive={() => this.isActive}

          className={cssNames("nav-item flex gaps align-center", {
            expandable: this.isExpandable,
          })}

          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (this.isExpandable) {
              this.toggleExpand();
            } else {
              this.props.asd.item.onClick();
            }
          }}
          data-testid={`sidebar-item-link-for-${this.id}`}
        >
          {this.props.asd.item.getIcon?.()}
          <span className="link-text box grow">{this.props.asd.item.title}</span>
          {this.isExpandable && (
            <Icon
              className="expand-icon box right"
              material={
                this.expanded ? "keyboard_arrow_up" : "keyboard_arrow_down"
              }
            />
          )}
        </NavLink>
        {this.renderSubMenu()}
      </div>
    );
  }
}

export const SidebarItem = withInjectables<Dependencies, SidebarItemProps>(
  NonInjectedSidebarItem,

  {
    getProps: (di, props) => ({
      sidebarStorage: di.inject(sidebarStorageInjectable),
      ...props,
    }),
  },
);
