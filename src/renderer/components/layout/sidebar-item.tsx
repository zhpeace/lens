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
import sidebarStorageInjectable, { SidebarStorageState } from "./sidebar-storage/sidebar-storage.injectable";

interface Dependencies {
  sidebarStorage: StorageHelper<SidebarStorageState>
}

export interface SidebarItemProps {
  title: string;
  onClick: () => void;
  getIcon?: () => React.ReactNode
  isActive: boolean
  id: string;
  parentId: string | null
}

@observer
class NonInjectedSidebarItem extends React.Component<SidebarItemProps & Dependencies> {
  static displayName = "SidebarItem";

  constructor(props: SidebarItemProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  get id(): string {
    return this.props.id;
  }

  @computed get expanded(): boolean {
    return Boolean(this.props.sidebarStorage.get().expanded[this.id]);
  }

  @computed get isExpandable(): boolean {
    return React.Children.count(this.props.children) > 0;
  }

  toggleExpand = () => {
    this.props.sidebarStorage.merge(draft => {
      draft.expanded[this.id] = !draft.expanded[this.id];
    });
  };

  renderSubMenu() {
    const { isExpandable, expanded } = this;

    if (!isExpandable || !expanded) {
      return null;
    }

    return (
      <ul className={cssNames("sub-menu", { active: this.props.isActive })}>
        {this.props.children}
      </ul>
    );
  }

  render() {
    const { onClick } = this.props;

    const { id, expanded, isExpandable, toggleExpand } = this;

    const classNames = cssNames("SidebarItem");

    return (
      <div className={classNames} data-test-id={id}>
        <NavLink
          to={""}
          isActive={() => this.props.isActive}
          className={cssNames("nav-item flex gaps align-center", {
            expandable: isExpandable,
          })}

          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (isExpandable) {
              toggleExpand();
            } else {
              onClick();
            }
          }}
        >
          {this.props.getIcon?.()}
          <span className="link-text box grow">{this.props.title}</span>
          {isExpandable && (
            <Icon
              className="expand-icon box right"
              material={expanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
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
