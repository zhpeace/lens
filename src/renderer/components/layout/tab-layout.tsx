/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./tab-layout.scss";

import React from "react";
import { matchPath, Redirect, Route, Switch } from "react-router";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";
import { Tab, Tabs } from "../tabs";
import { ErrorBoundary } from "../error-boundary";
import { navigate, navigation } from "../../navigation";
import type { HierarchicalSidebarItem } from "./sidebar-items.injectable";

export interface TabLayoutProps {
  className?: IClassName;
  contentClass?: IClassName;
  tabs?: TabLayoutRoute[];
  newTabs?: HierarchicalSidebarItem[];
  children?: React.ReactNode;
}

export interface TabLayoutRoute {
  routePath: string;
  title: React.ReactNode;
  component: React.ComponentType<any>;
  url?: string; // page-url, if not provided `routePath` is used (doesn't work when path has some :placeholder(s))
  exact?: boolean; // route-path matching rule
  default?: boolean; // initial tab to open with provided `url, by default tabs[0] is used
}

export const TabLayout = observer(
  ({
    className,
    contentClass,
    newTabs = [],
    tabs = [],
    children,
  }: TabLayoutProps) => {
    const currentLocation = navigation.location.pathname;
    const hasTabs = tabs.length > 0;
    const hasNewTabs = newTabs.length > 0;
    const startTabUrl = hasTabs
      ? (tabs.find((tab) => tab.default) || tabs[0])?.url
      : null;

    return (
      <div
        className={cssNames("TabLayout", className)}
        data-testid="tab-layout"
      >
        {hasTabs && (
          <Tabs center onChange={(url) => navigate(url)}>
            {tabs.map(({ title, routePath, url = routePath, exact }) => {
              const isActive = !!matchPath(currentLocation, {
                path: routePath,
                exact,
              });

              return (
                <Tab key={url} label={title} value={url} active={isActive} />
              );
            })}
          </Tabs>
        )}

        {hasNewTabs && (
          <Tabs center>
            {newTabs.map(({ item, isActive }) => {
              const active = isActive.get();

              return (
                <Tab
                  onClick={item.onClick}
                  key={item.title}
                  label={item.title}
                  active={active}
                  data-is-active-test={active}
                  data-testid={`tab-link-for-${item.id}`}
                />
              );
            })}
          </Tabs>
        )}

        <main className={cssNames(contentClass)}>
          <ErrorBoundary>
            {hasTabs && (
              <Switch>
                {tabs.map(({ routePath, exact, component }) => {
                  return (
                    <Route
                      key={routePath}
                      exact={exact}
                      path={routePath}
                      component={component}
                    />
                  );
                })}
                <Redirect to={startTabUrl} />
              </Switch>
            )}
            {children}
          </ErrorBoundary>
        </main>
      </div>
    );
  },
);
