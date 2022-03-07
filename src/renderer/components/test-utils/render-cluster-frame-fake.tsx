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

export interface Renderer {
  beforeSetups: (callback: () => void) => Renderer;
  beforeRender: (callback: () => void) => Renderer;
  render: () => Promise<RenderResult>;
}

export const renderClusterFrameFakeFor = ({ di, extensions = [] }: Options) => {
  let beforeSetupsCallback: () => void;
  let beforeRenderCallback: () => void;

  di.override(subscribeStoresInjectable, () => () => () => {});

  di.override(rendererExtensionsInjectable, () => computed(() => extensions));

  di.override(currentlyInClusterFrameInjectable, () => true);

  di.override(allowedResourcesInjectable, () =>
    computed(() => new Set<string>()),
  );

  const renderer: Renderer = {
    beforeSetups(callback: () => void) {
      beforeSetupsCallback = callback;

      return renderer;
    },

    beforeRender(callback: () => void) {
      beforeRenderCallback = callback;

      return renderer;
    },

    async render() {
      beforeSetupsCallback?.();

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

      beforeRenderCallback?.();

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

  return renderer;
};

export const renderClusterFrameFake = ({ di, extensions = [] }: Options) => {
  di.override(subscribeStoresInjectable, () => () => () => {});

  di.override(rendererExtensionsInjectable, () => computed(() => extensions));

  di.override(currentlyInClusterFrameInjectable, () => true);

  di.override(allowedResourcesInjectable, () =>
    computed(() => new Set<string>()),
  );

  return async () => {
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
  };
};
