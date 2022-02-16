/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./cluster-manager.scss";

import React from "react";
import { Redirect, Switch } from "react-router";
import { observer } from "mobx-react";
import { StatusBar } from "../status-bar/status-bar";
import { HotbarMenu } from "../hotbar/hotbar-menu";
import * as routes from "../../../common/routes";
import { DeleteClusterDialog } from "../delete-cluster-dialog";
import { withInjectables } from "@ogre-tools/injectable-react";
import { TopBar } from "../layout/top-bar/top-bar";
import catalogPreviousActiveTabStorageInjectable from "../+catalog/catalog-previous-active-tab-storage/catalog-previous-active-tab-storage.injectable";
import currentRouteInjectable from "../../routes/current-route.injectable";
import type { Route } from "../../routes/routes.injectable";
import type { IComputedValue } from "mobx";

interface Dependencies {
  catalogPreviousActiveTabStorage: { get: () => string }
  currentRoute: IComputedValue<Route>
}

@observer
class NonInjectedClusterManager extends React.Component<Dependencies> {
  componentDidMount() {
    // disposeOnUnmount(this, [
    //   reaction(() => navigation.location, () => setEntityOnRouteMatch(), { fireImmediately: true }),
    // ]);
  }

  render() {
    const currentRoute = this.props.currentRoute.get();

    if (!currentRoute) {
      return <Redirect exact to={routes.welcomeURL()} />;
    }

    const { Component } = currentRoute;

    return (
      <div className="ClusterManager">
        <TopBar />
        <main>
          <div id="lens-views" />

          <Component />

          <Switch>
            {/*<Redirect*/}
            {/*  exact*/}
            {/*  from={catalogURL()}*/}
            {/*  to={getPreviousTabUrl(*/}
            {/*    this.props.catalogPreviousActiveTabStorage.get(),*/}
            {/*  )}*/}
            {/*/>*/}

            {/*{GlobalPageRegistry.getInstance()*/}
            {/*  .getItems()*/}
            {/*  .map(({ url, components: { Page }}) => (*/}
            {/*    <Route key={url} path={url} component={Page} />*/}
            {/*  ))}*/}
            {/*<Redirect exact to={routes.welcomeURL()} />*/}
          </Switch>
        </main>
        <HotbarMenu />
        <StatusBar />
        <DeleteClusterDialog />
      </div>
    );
  }
}

export const ClusterManager = withInjectables<Dependencies>(NonInjectedClusterManager, {
  getProps: di => ({
    catalogPreviousActiveTabStorage: di.inject(catalogPreviousActiveTabStorageInjectable),
    currentRoute: di.inject(currentRouteInjectable),
  }),
});
