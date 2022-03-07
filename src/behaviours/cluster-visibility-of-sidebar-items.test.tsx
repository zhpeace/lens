/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { DiContainer, getInjectable } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../renderer/getDiForUnitTesting";
import type { RenderResult } from "@testing-library/react";
import {
  ClusterFrameBuilder,
  getClusterFrameBuilder,
} from "../renderer/components/test-utils/get-cluster-frame-builder";
import {
  SidebarItemRegistration,
  sidebarItemsInjectionToken,
} from "../renderer/components/layout/sidebar-items.injectable";
import { computed } from "mobx";
import directoryForLensLocalStorageInjectable from "../common/directory-for-lens-local-storage/directory-for-lens-local-storage.injectable";
import { routeInjectionToken } from "../renderer/routes/all-routes.injectable";
import { routeSpecificComponentInjectionToken } from "../renderer/routes/route-specific-component-injection-token";
import React from "react";
import navigateToRouteInjectable from "../renderer/routes/navigate-to-route.injectable";
import isAllowedResourceInjectable from "../common/utils/is-allowed-resource.injectable";

describe("cluster visibility of sidebar items", () => {
  let di: DiContainer;
  let rendered: RenderResult;

  beforeEach(() => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    di.override(directoryForLensLocalStorageInjectable, () => "/irrelevant");

    const routeInjectable = getInjectable({
      id: "some-route-injectable-id",

      instantiate: (di) => {
        const someKubeResourceName = "namespaces";

        const kubeResourceIsAllowed = di.inject(
          isAllowedResourceInjectable,
          someKubeResourceName,
        );

        return {
          path: "/some-child-page",
          isEnabled: kubeResourceIsAllowed,
          clusterFrame: true,
        };
      },

      injectionToken: routeInjectionToken,
    });

    di.register(routeInjectable);

    const routeComponentInjectable = getInjectable({
      id: "some-child-page-route-component-injectable",

      instantiate: (di) => ({
        route: di.inject(routeInjectable),
        Component: () => <div data-testid="some-child-page" />,
      }),

      injectionToken: routeSpecificComponentInjectionToken,
    });

    const navigateToRoute = di.inject(navigateToRouteInjectable);

    const sidebarItemsInjectable = getInjectable({
      id: "some-sidebar-item-injectable",

      instantiate: () => {
        const testRoute = di.inject(routeInjectable);

        return computed((): SidebarItemRegistration[] => {
          return [
            {
              id: "some-item-id",
              parentId: null,
              title: "Some item",
              onClick: () => navigateToRoute(testRoute),
              isVisible: testRoute.isEnabled,
              orderNumber: 42,
            },
          ];
        });
      },

      injectionToken: sidebarItemsInjectionToken,
    });

    di.register(routeComponentInjectable);
    di.register(sidebarItemsInjectable);
  });

  describe("given kube resource for route is not allowed", () => {
    let clusterFrameBuilder: ClusterFrameBuilder;

    beforeEach(async () => {
      clusterFrameBuilder = getClusterFrameBuilder(di);

      rendered = await clusterFrameBuilder.render();
    });

    it("renders", () => {
      expect(rendered.container).toMatchSnapshot();
    });

    it("related sidebar item does not exist", () => {
      const item = getSidebarItem(rendered, "some-item-id");

      expect(item).toBeNull();
    });

    describe("when kube resource becomes allowed", () => {
      beforeEach(() => {
        clusterFrameBuilder.allowKubeResource("namespaces");
      });

      it("renders", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("related sidebar item exists", () => {
        const item = getSidebarItem(rendered, "some-item-id");

        expect(item).not.toBeNull();
      });
    });
  });
});

const getSidebarItem = (rendered: RenderResult, itemId: string) =>
  rendered
    .queryAllByTestId("sidebar-item")
    .find((x) => x.dataset.idTest === itemId) || null;
