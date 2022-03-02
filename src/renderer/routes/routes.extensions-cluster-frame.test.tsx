/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { DiContainer } from "@ogre-tools/injectable";
import { RenderResult, screen } from "@testing-library/react";
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

import type {
  ClusterPageMenuRegistration,
  PageRegistration,
} from "../../extensions/registries";
import { renderFor } from "../components/test-utils/renderFor";
import { Observer } from "mobx-react";
import type { Cluster } from "../../common/cluster/cluster";
import hostedClusterInjectable from "../../common/cluster-store/hosted-cluster.injectable";
import customResourceDefinitionsInjectable from "../components/+custom-resources/custom-resources.injectable";
import type { CustomResourceDefinition } from "../../common/k8s-api/endpoints";
import currentRouteComponentInjectable from "./current-route-component.injectable";

describe("routes - extensions - cluster frame", () => {
  let history: MemoryHistory;
  let di: DiContainer;
  let rendered: RenderResult;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    di.override(
      directoryForUserDataInjectable,
      () => "some-directory-for-user-data",
    );

    const extension = new TestExtension({
      id: "@some/extension-id",

      clusterPages: [
        {
          components: {
            Page: () => <div data-testid="some-route-from-extension" />,
          },
        },
        {
          id: "//some-child-page/",
          components: {
            Page: () => <div data-testid="some-child-page-from-extension"/>,
          },
        },
        {
          id: "some-other-child-page",
          components: {
            Page: () => <div data-testid="some-other-child-page-from-extension" />,
          },
        },
      ],

      clusterPageMenus: [
        {
          id: "some-parent-id",
          title: "Parent",
          components: {
            Icon: () => <div>Some icon</div>,
          },
        },
        {
          id: "some-child-id",
          parentId: "some-parent-id",
          target: { pageId: "//some-child-page/" },
          title: "Child 1",

          components: {
            Icon: () => <div>Some icon</div>,
          },
        },
        {
          id: "some-other-child",
          parentId: "some-parent-id",
          target: { pageId: "some-other-child-page" },
          title: "Child 2",
          components: {
            Icon: () => <div>Some icon</div>,
          },
        },
      ],

      globalPages: [],
    });

    di.override(rendererExtensionsInjectable, () =>
      computed((): LensRendererExtension[] => [extension]),
    );

    history = createMemoryHistory();
    const observableHistory = createObservableHistory(history);

    di.override(observableHistoryInjectable, () => observableHistory);
    di.override(currentlyInClusterFrameInjectable, () => true);

    const clusterStub = {
      allowedResources: [],
    } as Cluster;

    di.override(hostedClusterInjectable, () => clusterStub);

    di.override(customResourceDefinitionsInjectable, () =>
      computed((): CustomResourceDefinition[] => []),
    );

    await di.runSetups();

    const render = renderFor(di);

    const currentRouteComponent = di.inject(currentRouteComponentInjectable);

    rendered = render(
      <Observer>
        {() => {
          const Component = currentRouteComponent.get();

          if (!Component) {
            return <div data-testid="no-active-route" />;
          }

          return <Component />;
        }}
      </Observer>,
    );
  });

  it("renders without active route", () => {
    screen.getByTestId("no-active-route");
  });

  describe("when navigating to extension front page", () => {
    beforeEach(() => {
      runInAction(() => {
        history.replace("/extension/some--extension-id");
      });
    });

    it("renders", () => {
      expect(rendered.container).toMatchSnapshot();
    });

    it("shows component for parent route", () => {
      screen.getByTestId("some-route-from-extension");
    });

    describe("when navigating to extension child page", () => {
      beforeEach(() => {
        runInAction(() => {
          history.replace("/extension/some--extension-id/some-child-page");
        });
      });

      it("renders", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("shows component for child route having matching ID", () => {
        screen.getByTestId("some-child-page-from-extension");
      });
    });
  });
});

class TestExtension extends LensRendererExtension {
  constructor({
    id,
    globalPages,
    clusterPages,
    clusterPageMenus,
  }: {
    id: string;
    globalPages: PageRegistration[];
    clusterPages: PageRegistration[];
    clusterPageMenus: ClusterPageMenuRegistration[];
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
    this.clusterPageMenus = clusterPageMenus;
  }
}
