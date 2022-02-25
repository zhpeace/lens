/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import type { DiContainer } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../getDiForUnitTesting";
import React from "react";
import { computed } from "mobx";
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
  let extension: TestExtension;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    di.override(
      directoryForUserDataInjectable,
      () => "some-directory-for-user-data",
    );

    extension = new TestExtension({
      id: "some-extension-id",
      clusterPages: [],

      globalPages: [
        {
          components: {
            Page: ({ params }) => {
              return (
                <Observer>
                  {() => (
                    <div>
                      <span data-testid="non-normalized-parameter-value">
                        {params.someNonNormalizedParameter.get()}
                      </span>

                      <span data-testid="normalized-parameter-value">
                        {params.someNormalizedParameter.get()}
                      </span>

                      <button
                        data-testid="change-non-normalized-parameter-value"
                        onClick={() =>
                          params.someNonNormalizedParameter.set(
                            "some-changed-value-for-non-normalized-parameter",
                          )
                        }
                      />
                    </div>
                  )}
                </Observer>
              );
            },
          },

          params: {
            someNonNormalizedParameter: "some-initial-value-for-non-normalized-parameter",

            someNormalizedParameter: {
              defaultValue: "some-initial-value-for-normalized-parameter",

              stringify: (value) =>
                value === "some-value-to-be-stringified" &&
                "some-stringified-value",

              parse: (value) =>
                value === "some-stringified-value" ? "some-parsed-value" : value,
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

  describe("when navigating to any route from extension with parameters", () => {
    beforeEach(async () => {
      const irrelevant = "";

      await extension.navigate(irrelevant, {
        someNonNormalizedParameter: ["some-value", "some-other-value"],
        someNormalizedParameter: "some-value-to-be-stringified",
      });

    });

    it("updates URL", () => {
      const url = historyFake.location.pathname + historyFake.location.search;

      expect(url).toBe(
        "/extension/some-extension-id?some-extension-id%3AsomeNonNormalizedParameter=some-value%2Csome-other-value&some-extension-id%3AsomeNormalizedParameter=some-stringified-value",
      );
    });

    it("has value for non normalized parameter", () => {
      expect(screen.getByTestId("non-normalized-parameter-value")).toHaveTextContent(
        "some-value,some-other-value",
      );
    });

    it("has value for normalized parameter", () => {
      expect(screen.getByTestId("normalized-parameter-value")).toHaveTextContent(
        "some-parsed-value",
      );
    });
  });

  describe("when navigating to front page of extension", () => {
    beforeEach(async () => {
      await extension.navigate();
    });

    it("has value", () => {
      expect(screen.getByTestId("non-normalized-parameter-value")).toHaveTextContent(
        "some-initial-value-for-non-normalized-parameter",
      );
    });

    it("has value for normalized parameter", () => {
      expect(screen.getByTestId("normalized-parameter-value")).toHaveTextContent(
        "some-initial-value-for-normalized-parameter",
      );
    });


    it("renders", () => {
      expect(rendered.container).toMatchSnapshot();
    });

    describe("when page parameter is changed", () => {
      beforeEach(() => {
        const button = rendered.getByTestId("change-non-normalized-parameter-value");

        fireEvent.click(button);
      });

      it("updates URL", () => {
        const url = historyFake.location.pathname + historyFake.location.search;

        expect(url).toBe(
          "/extension/some-extension-id?some-extension-id%3AsomeNonNormalizedParameter=some-changed-value-for-non-normalized-parameter",
        );
      });

      it("has value", () => {
        expect(rendered.getByTestId("non-normalized-parameter-value")).toHaveTextContent(
          "some-changed-value-for-non-normalized-parameter",
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
