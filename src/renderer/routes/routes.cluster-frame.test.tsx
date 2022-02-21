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

describe("routes, given in cluster frame", () => {
  let history: MemoryHistory;
  let di: DiContainer;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    di.override(rendererExtensionsInjectable, () =>
      computed((): LensRendererExtension[] => []),
    );

    history = createMemoryHistory();
    const observableHistory = createObservableHistory(history);

    di.override(observableHistoryInjectable, () => observableHistory);
    di.override(currentlyInClusterFrameInjectable, () => true);
  });

  it("given same route is registered for both frames, when navigating, knows route in cluster frame", async () => {
    const routeInRootFrame = getInjectable({
      id: "some-route-in-root-frame",

      instantiate: () => ({
        title: "some-title",
        icon: "some-icon",

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
        title: "some-title",
        icon: "some-icon",
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

    runInAction(() => {
      history.replace("/some-path");
    });

    const currentRoute = di.inject(currentRouteInjectable);

    expect(currentRoute.get().clusterFrame).toBe(true);
  });
});
