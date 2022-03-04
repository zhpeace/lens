/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { DiContainer } from "@ogre-tools/injectable";
import type { LensRendererExtension } from "../../../extensions/lens-renderer-extension";
import rendererExtensionsInjectable from "../../../extensions/renderer-extensions.injectable";
import currentlyInClusterFrameInjectable from "../../routes/currently-in-cluster-frame.injectable";
import type { Cluster } from "../../../common/cluster/cluster";
import hostedClusterInjectable from "../../../common/cluster-store/hosted-cluster.injectable";
import { extensionRegistratorInjectionToken } from "../../../extensions/extension-loader/extension-registrator-injection-token";
import { computed } from "mobx";
import { renderFor } from "./renderFor";
import observableHistoryInjectable from "../../navigation/observable-history.injectable";
import currentRouteComponentInjectable from "../../routes/current-route-component.injectable";
import { Sidebar } from "../layout/sidebar";
import React from "react";
import { Router } from "react-router";
import { Observer } from "mobx-react";
import subscribeStoresInjectable from "../../kube-watch-api/subscribe-stores.injectable";

interface Options {
  di: DiContainer;
  extensions: LensRendererExtension[];
}

export const renderClusterFrameFake = async ({ di, extensions = [] }: Options) => {
  di.override(subscribeStoresInjectable, () => () => () => {});

  di.override(rendererExtensionsInjectable, () => computed(() => extensions));

  di.override(currentlyInClusterFrameInjectable, () => true);

  const clusterStub = { allowedResources: [] } as Cluster;

  di.override(hostedClusterInjectable, () => clusterStub);

  await di.runSetups();

  const extensionRegistrators = di.injectMany(
    extensionRegistratorInjectionToken,
  );

  await Promise.all(
    extensions.flatMap((extension) =>
      extensionRegistrators.map((registrator) => registrator(extension, 1)),
    ),
  );

  const render = renderFor(di);

  const history = di.inject(observableHistoryInjectable);
  const currentRouteComponent = di.inject(currentRouteComponentInjectable);

  return () => render(
    <Router history={history}>
      <Sidebar />

      <Observer>
        {() => {
          const Component = currentRouteComponent.get();

          if (!Component) {
            return null;
          }

          return <Component />;
        }}
      </Observer>
    </Router>,
  );
};
