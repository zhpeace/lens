/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { DiContainer, getInjectable } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../getDiForUnitTesting";
import { computed, runInAction } from "mobx";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { createMemoryHistory, MemoryHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";
import { routeInjectionToken } from "./all-routes.injectable";
import React from "react";
import currentRouteInjectable from "./current-route.injectable";
import currentlyInClusterFrameInjectable from "./currently-in-cluster-frame.injectable";
import directoryForUserDataInjectable from "../../common/app-paths/directory-for-user-data/directory-for-user-data.injectable";
import mockFs from "mock-fs";
import hostedClusterInjectable from "../../common/cluster-store/hosted-cluster.injectable";
import type { Cluster } from "../../common/cluster/cluster";

describe("routes, communication between frames", () => {
  let history: MemoryHistory;
  let di: DiContainer;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    mockFs();

    di.override(
      directoryForUserDataInjectable,
      () => "some-directory-for-user-data",
    );

    di.override(rendererExtensionsInjectable, () =>
      computed((): LensRendererExtension[] => []),
    );

    history = createMemoryHistory();
    const observableHistory = createObservableHistory(history);

    di.override(observableHistoryInjectable, () => observableHistory);

    const routeInRootFrame = getInjectable({
      id: "some-route-in-root-frame",

      instantiate: () => ({
        path: "/some-path",
        Component: () => <div />,
        clusterFrame: false,
        isEnabled: () => true,
      }),

      injectionToken: routeInjectionToken,
    });

    const routeInClusterFrame = getInjectable({
      id: "some-route-in-cluster-frame",

      instantiate: () => ({
        path: "/some-path",
        Component: () => <div />,
        clusterFrame: true,
        isEnabled: () => true,
      }),

      injectionToken: routeInjectionToken,
    });

    di.register(routeInRootFrame);
    di.register(routeInClusterFrame);

    await di.runSetups();
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe("given in cluster frame", () => {
    beforeEach(() => {
      di.override(currentlyInClusterFrameInjectable, () => true);

      const clusterStub = {
        allowedResources: [],
      } as Cluster;

      di.override(hostedClusterInjectable, () => clusterStub);
    });

    it("when navigating to path existing in both frames, knows route from cluster frame", async () => {
      runInAction(() => {
        history.replace("/some-path");
      });

      const currentRoute = di.inject(currentRouteInjectable);

      expect(currentRoute.get().clusterFrame).toBe(true);
    });
  });

  describe("given in root frame", () => {
    beforeEach(() => {
      di.override(currentlyInClusterFrameInjectable, () => false);
      di.override(hostedClusterInjectable, () => null);
    });

    it("when navigating to path existing in both frames, knows route from root frame", async () => {
      runInAction(() => {
        history.replace("/some-path");
      });

      const currentRoute = di.inject(currentRouteInjectable);

      expect(currentRoute.get().clusterFrame).toBe(false);
    });
  });
});
