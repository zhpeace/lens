/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { DiContainer } from "@ogre-tools/injectable";
import type { LensRendererExtension } from "../../../extensions/lens-renderer-extension";
import rendererExtensionsInjectable from "../../../extensions/renderer-extensions.injectable";
import currentlyInClusterFrameInjectable from "../../routes/currently-in-cluster-frame.injectable";
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
import allowedResourcesInjectable from "../../../common/cluster-store/allowed-resources.injectable";
import type { RenderResult } from "@testing-library/react";

interface Options {
  di: DiContainer;
  extensions: LensRendererExtension[];
}

type Callback = () => void;

export interface ClusterFrameBuilder {
  beforeSetups: (callback: Callback) => ClusterFrameBuilder;
  beforeRender: (callback: Callback) => ClusterFrameBuilder;
  render: () => Promise<RenderResult>;
}

export const getClusterFrameBuilder = ({ di, extensions = [] }: Options) => {
  const beforeSetupsCallbacks: Callback[] = [];
  const beforeRenderCallbacks: Callback[] = [];

  di.override(subscribeStoresInjectable, () => () => () => {});

  di.override(rendererExtensionsInjectable, () => computed(() => extensions));

  di.override(currentlyInClusterFrameInjectable, () => true);

  di.override(allowedResourcesInjectable, () =>
    computed(() => new Set<string>()),
  );

  const builder: ClusterFrameBuilder = {
    beforeSetups(callback: () => void) {
      beforeSetupsCallbacks.push(callback);

      return builder;
    },

    beforeRender(callback: () => void) {
      beforeRenderCallbacks.push(callback);

      return builder;
    },

    async render() {
      beforeSetupsCallbacks.forEach(callback => callback());

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

      beforeRenderCallbacks.forEach(callback => callback());

      return render(
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
    },
  };

  return builder;
};
