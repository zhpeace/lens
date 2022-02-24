/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { DiContainer } from "@ogre-tools/injectable";
import { screen } from "@testing-library/react";
import { getDiForUnitTesting } from "../getDiForUnitTesting";
import React from "react";
import { computed, runInAction } from "mobx";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { createMemoryHistory, MemoryHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";
import currentlyInClusterFrameInjectable from "./currently-in-cluster-frame.injectable";
import mockFs from "mock-fs";
import directoryForUserDataInjectable from "../../common/app-paths/directory-for-user-data/directory-for-user-data.injectable";

import type { PageRegistration } from "../../extensions/registries";
import { renderFor } from "../components/test-utils/renderFor";
import { Observer } from "mobx-react";
import currentRouteInjectable from "./current-route.injectable";

describe("routes - extensions - root frame", () => {
  let history: MemoryHistory;
  let di: DiContainer;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    mockFs();

    di.override(
      directoryForUserDataInjectable,
      () => "some-directory-for-user-data",
    );

    const extension = new TestExtension({
      id: "@some/extension-id",
      clusterPages: [],

      globalPages: [
        {
          components: {
            Page: () => <div data-testid="some-route-from-extension" />,
          },
        },
        {
          id: "//some-child-page/",
          components: {
            Page: () => <div data-testid="some-child-route-from-extension" />,
          },
        },

      ],
    });

    di.override(rendererExtensionsInjectable, () =>
      computed((): LensRendererExtension[] => [extension]),
    );

    history = createMemoryHistory();
    const observableHistory = createObservableHistory(history);

    di.override(observableHistoryInjectable, () => observableHistory);
    di.override(currentlyInClusterFrameInjectable, () => false);

    await di.runSetups();

    const render = renderFor(di);

    const currentRoute = di.inject(currentRouteInjectable);

    render(
      <Observer>
        {() => {
          const route = currentRoute.get();

          if (!route) {
            return <div data-testid="no-active-route" />;
          }

          return <route.Component />;
        }}
      </Observer>,
    );
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("renders without active route", () => {
    screen.getByTestId("no-active-route");
  });

  it("when navigating to extension front page, renders with extension route containing no ID", () => {
    runInAction(() => {
      history.replace("/extension/some--extension-id");
    });

    screen.getByTestId("some-route-from-extension");
  });

  it("when navigating to extension child page, renders with extension route having matching ID", () => {
    runInAction(() => {
      history.replace("/extension/some--extension-id/some-child-page");
    });

    screen.getByTestId("some-child-route-from-extension");
  });
});

class TestExtension extends LensRendererExtension {
  constructor({
    id,
    globalPages,
    clusterPages,
  }: {
    id: string;
    globalPages: PageRegistration[];
    clusterPages: PageRegistration[];
  }) {
    super({
      id,
      absolutePath: "irrelevant",
      isBundled: false,
      isCompatible: false,
      isEnabled: false,
      manifest: { name: id, version: "some-version" },
      manifestPath: "irrelevant",
    });

    this.globalPages = globalPages;
    this.clusterPages = clusterPages;
  }
}
