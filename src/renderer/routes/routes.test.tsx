/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { DiContainer, getInjectable } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../getDiForUnitTesting";
import { routeInjectionToken } from "./all-routes.injectable";
import React from "react";
import { computed, runInAction } from "mobx";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import type { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import currentRouteInjectable from "./current-route.injectable";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { createMemoryHistory, MemoryHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";
import queryParametersInjectable from "./query-parameters.injectable";
import pathParametersInjectable from "./path-parameters.injectable";
import currentlyInClusterFrameInjectable from "./currently-in-cluster-frame.injectable";
import mockFs from "mock-fs";
import directoryForUserDataInjectable
  from "../../common/app-paths/directory-for-user-data/directory-for-user-data.injectable";

describe("routes", () => {
  let history: MemoryHistory;
  let di: DiContainer;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    mockFs();

    di.override(directoryForUserDataInjectable, () => "some-directory-for-user-data");

    di.override(rendererExtensionsInjectable, () =>
      computed((): LensRendererExtension[] => []),
    );

    history = createMemoryHistory();
    const observableHistory = createObservableHistory(history);

    di.override(observableHistoryInjectable, () => observableHistory);
    di.override(currentlyInClusterFrameInjectable, () => false);
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe("given route without path parameters", () => {
    beforeEach(async () => {
      const routeWithoutPathParameters = getInjectable({
        id: "some-route",
        injectionToken: routeInjectionToken,

        instantiate: () => ({
          path: "/some-path",
          Component: () => <div />,
          clusterFrame: false,
          isEnabled: () => true,
        }),
      });

      di.register(routeWithoutPathParameters);

      await di.runSetups();
    });

    describe("when navigating to route", () => {
      beforeEach(() => {
        runInAction(() => {
          history.replace("/some-path");
        });
      });

      it("knows current route", () => {
        const currentRoute = di.inject(currentRouteInjectable);

        expect(currentRoute.get().path).toBe("/some-path");
      });

      it("does not have query parameters", () => {
        const queryParameters = di.inject(queryParametersInjectable);

        expect(queryParameters.get()).toEqual({});
      });

      it("does not have path parameters", () => {
        const pathParameters = di.inject(pathParametersInjectable);

        expect(pathParameters.get()).toEqual({});
      });
    });

    it("when navigating to route with query parameters, knows query parameters", () => {
      history.replace(
        "/some-path?someParameter=some-value&someOtherParameter=some-other-value",
      );

      const queryParameters = di.inject(queryParametersInjectable);

      expect(queryParameters.get()).toEqual({
        someParameter: "some-value",
        someOtherParameter: "some-other-value",
      });
    });
  });

  describe("given route with optional path parameters", () => {
    beforeEach(async () => {
      const routeWithPathParameters = getInjectable({
        id: "some-route",
        injectionToken: routeInjectionToken,

        instantiate: () => ({
          path: "/some-path/:someParameter?/:someOtherParameter?",
          Component: () => <div />,
          clusterFrame: false,
          isEnabled: () => true,
        }),
      });

      di.register(routeWithPathParameters);

      await di.runSetups();
    });

    describe("when navigating to route with path parameters", () => {
      beforeEach(() => {
        runInAction(() => {
          history.replace(
            "/some-path/some-value/some-other-value",
          );
        });
      });

      it("knows current route", () => {
        const currentRoute = di.inject(currentRouteInjectable);

        expect(currentRoute.get().path).toBe("/some-path/:someParameter?/:someOtherParameter?");
      });

      it("knows path parameters", () => {
        const pathParameters = di.inject(pathParametersInjectable);

        expect(pathParameters.get()).toEqual({
          someParameter: "some-value",
          someOtherParameter: "some-other-value",
        });
      });
    });

    describe("when navigating to route without path parameters", () => {
      beforeEach(() => {
        runInAction(() => {
          history.replace(
            "/some-path",
          );
        });
      });

      it("knows current route", () => {
        const currentRoute = di.inject(currentRouteInjectable);

        expect(currentRoute.get().path).toBe("/some-path/:someParameter?/:someOtherParameter?");
      });

      it("knows path parameters", () => {
        const pathParameters = di.inject(pathParametersInjectable);

        expect(pathParameters.get()).toEqual({
          someParameter: undefined,
          someOtherParameter: undefined,
        });
      });
    });
  });
});
