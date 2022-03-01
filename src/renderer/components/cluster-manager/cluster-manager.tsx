/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./cluster-manager.scss";

import React from "react";
import { Redirect } from "react-router";
import { observer } from "mobx-react";
import { StatusBar } from "../status-bar/status-bar";
import { HotbarMenu } from "../hotbar/hotbar-menu";
import * as routes from "../../../common/routes";
import { DeleteClusterDialog } from "../delete-cluster-dialog";
import { withInjectables } from "@ogre-tools/injectable-react";
import { TopBar } from "../layout/top-bar/top-bar";
import catalogPreviousActiveTabStorageInjectable from "../+catalog/catalog-previous-active-tab-storage/catalog-previous-active-tab-storage.injectable";
import type { IComputedValue } from "mobx";
import currentRouteComponentInjectable from "../../routes/current-route-component.injectable";

interface Dependencies {
  catalogPreviousActiveTabStorage: { get: () => string }
  currentRouteComponent: IComputedValue<React.ElementType>
}

@observer
class NonInjectedClusterManager extends React.Component<Dependencies> {
  componentDidMount() {
    // disposeOnUnmount(this, [
    //   reaction(() => navigation.location, () => setEntityOnRouteMatch(), { fireImmediately: true }),
    // ]);
  }

  render() {
    const Component = this.props.currentRouteComponent.get();

    if (!Component) {
      return <Redirect exact to={routes.welcomeURL()} />;
    }

    return (
      <div className="ClusterManager">
        <TopBar />
        <main>
          <div id="lens-views" />

          <Component />

          {/*<Switch>*/}
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
          {/*</Switch>*/}
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
    currentRouteComponent: di.inject(currentRouteComponentInjectable),
  }),
});
