/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import type { DiContainer } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../getDiForUnitTesting";
import React from "react";
import { computed, runInAction } from "mobx";
import rendererExtensionsInjectable from "../../extensions/renderer-extensions.injectable";
import { LensRendererExtension } from "../../extensions/lens-renderer-extension";
import observableHistoryInjectable from "../navigation/observable-history.injectable";
import { createMemoryHistory, MemoryHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";
import currentlyInClusterFrameInjectable from "./currently-in-cluster-frame.injectable";
import directoryForUserDataInjectable from "../../common/app-paths/directory-for-user-data/directory-for-user-data.injectable";

import type { PageRegistration } from "../../extensions/registries";
import { renderFor } from "../components/test-utils/renderFor";
import { Observer } from "mobx-react";
import currentRouteInjectable from "./current-route.injectable";
import type { RenderResult } from "@testing-library/react";

describe("routes - extensions - page with parameters", () => {
  let historyFake: MemoryHistory;
  let di: DiContainer;
  let rendered: RenderResult;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    di.override(
      directoryForUserDataInjectable,
      () => "some-directory-for-user-data",
    );

    const extension = new TestExtension({
      id: "some-extension-id",
      clusterPages: [],

      globalPages: [
        {
          components: {
            Page: ({ params }) => {
              return (
                <div>
                  <span data-testid="test-value">
                    {params.someNonNormalizedParameter.get()}
                  </span>

                  {params.someNormalizedParameter.get()}

                  <button
                    data-testid="some-button"
                    onClick={() =>
                      params.someNonNormalizedParameter.set(
                        "some-changed-value",
                      )
                    }
                  />
                </div>
              );
            },
          },

          params: {
            someNonNormalizedParameter: "some-initial-value",

            someNormalizedParameter: {
              defaultValue: "some-initial-value",
              stringify: (asd) =>
                asd === "uusi-arvo" && "uusi-stringified-arvo",
              parse: (asd) =>
                asd === "uusi-stringified-arvo" && "some-changed-value",
            },
          },
        },
      ],
    });

    di.override(rendererExtensionsInjectable, () =>
      computed(() => [extension]),
    );

    historyFake = createMemoryHistory();
    const observableHistory = createObservableHistory(historyFake);

    di.override(observableHistoryInjectable, () => observableHistory);
    di.override(currentlyInClusterFrameInjectable, () => false);

    await di.runSetups();

    const render = renderFor(di);

    const currentRoute = di.inject(currentRouteInjectable);

    rendered = render(
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

  describe("when accessing route", () => {
    beforeEach(() => {
      runInAction(() => {
        historyFake.replace("/extension/some-extension-id");
      });
    });

    it("has value", () => {
      expect(screen.getByTestId("test-value")).toHaveTextContent(
        "some-initial-value",
      );
    });

    it("renders", () => {
      expect(rendered.container).toMatchSnapshot();
    });

    describe("when page parameter is changed", () => {
      beforeEach(() => {
        const button = rendered.getByTestId("some-button");

        fireEvent.click(button);
      });

      it("updates URL", () => {
        const url = historyFake.location.pathname + historyFake.location.search;

        expect(url).toBe(
          "/extension/some-extension-id?some-extension-id%3AsomeNonNormalizedParameter=some-changed-value",
        );
      });

      it("has value", () => {
        expect(rendered.getByTestId("test-value")).toHaveTextContent(
          "some-changed-value",
        );
      });

      it("renders", () => {
        expect(rendered.container).toMatchSnapshot();
      });
    });
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
