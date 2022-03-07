/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { DiContainer, getInjectable } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../renderer/getDiForUnitTesting";
import React from "react";
import { fireEvent, RenderResult } from "@testing-library/react";
import { renderClusterFrameFake } from "../renderer/components/test-utils/render-cluster-frame-fake";
import directoryForLensLocalStorageInjectable from "../common/directory-for-lens-local-storage/directory-for-lens-local-storage.injectable";
import readJsonFileInjectable, { ReadJson } from "../common/fs/read-json-file.injectable";
import pathExistsInjectable, { PathExists } from "../common/fs/path-exists.injectable";
import writeJsonFileInjectable, { WriteJson } from "../common/fs/write-json-file.injectable";
import navigateToRouteInjectable, { NavigateToRoute } from "../renderer/routes/navigate-to-route.injectable";
import { Route, routeInjectionToken } from "../renderer/routes/all-routes.injectable";
import { routeSpecificComponentInjectionToken } from "../renderer/routes/route-specific-component-injection-token";
import { SidebarItemRegistration, sidebarItemsInjectionToken } from "../renderer/components/layout/sidebar-items.injectable";
import { computed } from "mobx";
import { noop } from "lodash/fp";
import routeIsActiveInjectable from "../renderer/routes/route-is-active.injectable";

describe("cluster sidebar and tab navigation for core", () => {
  let di: DiContainer;
  let rendered: RenderResult;
  let readJsonFileFake: ReadJson;
  let writeJsonFileFake: WriteJson;
  let pathExistsFake: PathExists;
  let navigateToRoute: NavigateToRoute;

  beforeEach(() => {
    jest.useFakeTimers();

    di = getDiForUnitTesting({ doGeneralOverrides: true });

    readJsonFileFake = di.inject(readJsonFileInjectable);
    writeJsonFileFake = di.inject(writeJsonFileInjectable);
    pathExistsFake = di.inject(pathExistsInjectable);
    navigateToRoute = di.inject(navigateToRouteInjectable);

    di.override(
      directoryForLensLocalStorageInjectable,
      () => "/some-directory-for-lens-local-storage",
    );
  });

  describe("given core registrations", () => {
    let render: () => RenderResult;
    let route: Route;

    beforeEach(async () => {
      const routeInjectable = getInjectable({
        id: "some-route-injectable-id",

        instantiate: () => ({
          path: "/some-child-page",
          isEnabled: () => true,
          clusterFrame: true,
        }),

        injectionToken: routeInjectionToken,
      });

      di.register(routeInjectable);

      route = di.inject(routeInjectable);

      const routeComponentInjectable = getInjectable({
        id: "some-child-page-route-component-injectable",

        instantiate: (di) => ({
          route: di.inject(routeInjectable),
          Component: () => <div data-testid="some-child-page" />,
        }),

        injectionToken: routeSpecificComponentInjectionToken,
      });

      const sidebarItemsInjectable = getInjectable({
        id: "some-sidebar-item-injectable",

        instantiate: () => {
          const routeIsActive = di.inject(routeIsActiveInjectable, route);

          return computed((): SidebarItemRegistration[] => {
            return [
              {
                id: "some-parent-id",
                parentId: null,
                title: "Some parent",
                onClick: noop,
                getIcon: () => <div data-testid="some-icon-for-parent" />,
                priority: 42,
              },

              {
                id: "some-child-id",
                parentId: "some-parent-id",
                title: "Some child",
                onClick: () => navigateToRoute(route),
                isActive: routeIsActive,
                priority: 42,
              },
            ];
          });
        },

        injectionToken: sidebarItemsInjectionToken,
      });

      di.register(routeComponentInjectable);
      di.register(sidebarItemsInjectable);

      render = await renderClusterFrameFake({
        di,
        extensions: [],
      });
    });

    describe("given no state for expanded sidebar items exists, and navigated to child sidebar item, when rendered", () => {
      beforeEach(async () => {
        navigateToRoute(route);

        rendered = render();
      });

      it("renders", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("parent is highlighted", () => {
        const parent = rendered.getByTestId(
          "sidebar-item-for-some-parent-id",
        );

        expect(parent.dataset.isActiveTest).toBe("true");
      });

      it("parent sidebar item is not expanded", () => {
        const child = rendered.queryByTestId(
          "sidebar-item-for-some-child-id",
        );

        expect(child).toBe(null);
      });

      it("child page is shown", () => {
        expect(rendered.getByTestId("some-child-page")).not.toBeNull();
      });
    });

    describe("given state for expanded sidebar items already exists, when rendered", () => {
      beforeEach(async () => {
        await writeJsonFileFake(
          "/some-directory-for-lens-local-storage/app.json",
          {
            sidebar: {
              expanded: { "some-parent-id": true },
              width: 200,
            },
          },
        );

        rendered = render();
      });

      it("renders", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("parent sidebar item is not highlighted", () => {
        const parent = rendered.getByTestId(
          "sidebar-item-for-some-parent-id",
        );

        expect(parent.dataset.isActiveTest).toBe("false");
      });

      it("parent sidebar item is expanded", () => {
        const child = rendered.queryByTestId(
          "sidebar-item-for-some-child-id",
        );

        expect(child).not.toBe(null);
      });
    });

    describe("given state for expanded unknown sidebar items already exists, when rendered", () => {
      beforeEach(async () => {
        await writeJsonFileFake(
          "/some-directory-for-lens-local-storage/app.json",
          {
            sidebar: {
              expanded: { "some-unknown-parent-id": true },
              width: 200,
            },
          },
        );

        rendered = render();
      });

      it("renders without errors", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("parent sidebar item is not expanded", () => {
        const child = rendered.queryByTestId(
          "sidebar-item-for-some-child-id",
        );

        expect(child).toBe(null);
      });
    });

    describe("given empty state for expanded sidebar items already exists, when rendered", () => {
      beforeEach(async () => {
        await writeJsonFileFake(
          "/some-directory-for-lens-local-storage/app.json",
          {
            someThingButSidebar: {},
          },
        );

        rendered = render();
      });

      it("renders without errors", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("parent sidebar item is not expanded", () => {
        const child = rendered.queryByTestId(
          "sidebar-item-for-some-child-id",
        );

        expect(child).toBe(null);
      });
    });

    describe("given no initially persisted state for sidebar items, when rendered", () => {
      beforeEach(async () => {
        rendered = render();
      });

      it("renders", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("parent sidebar item is not highlighted", () => {
        const parent = rendered.getByTestId(
          "sidebar-item-for-some-parent-id",
        );

        expect(parent.dataset.isActiveTest).toBe("false");
      });

      it("parent sidebar item is not expanded", () => {
        const child = rendered.queryByTestId(
          "sidebar-item-for-some-child-id",
        );

        expect(child).toBe(null);
      });

      describe("when a parent sidebar item is expanded", () => {
        beforeEach(() => {
          const parentLink = rendered.getByTestId(
            "sidebar-item-link-for-some-parent-id",
          );

          fireEvent.click(parentLink);
        });

        it("renders", () => {
          expect(rendered.container).toMatchSnapshot();
        });

        it("parent sidebar item is not highlighted", () => {
          const parent = rendered.getByTestId(
            "sidebar-item-for-some-parent-id",
          );

          expect(parent.dataset.isActiveTest).toBe("false");
        });

        it("parent sidebar item is expanded", () => {
          const child = rendered.queryByTestId(
            "sidebar-item-for-some-child-id",
          );

          expect(child).not.toBe(null);
        });

        describe("when a child of the parent is selected", () => {
          beforeEach(() => {
            const childLink = rendered.getByTestId(
              "sidebar-item-link-for-some-child-id",
            );

            fireEvent.click(childLink);
          });

          it("renders", () => {
            expect(rendered.container).toMatchSnapshot();
          });

          it("parent is highlighted", () => {
            const parent = rendered.getByTestId(
              "sidebar-item-for-some-parent-id",
            );

            expect(parent.dataset.isActiveTest).toBe("true");
          });

          it("child is highlighted", () => {
            const child = rendered.getByTestId(
              "sidebar-item-for-some-child-id",
            );

            expect(child.dataset.isActiveTest).toBe("true");
          });

          it("child page is shown", () => {
            expect(rendered.getByTestId("some-child-page")).not.toBeNull();
          });

          it("when not enough time passes, does not store state for expanded sidebar items to file system yet", async () => {
            jest.advanceTimersByTime(250 - 1);

            const actual = await pathExistsFake(
              "/some-directory-for-lens-local-storage/app.json",
            );

            expect(actual).toBe(false);
          });

          it("when enough time passes, stores state for expanded sidebar items to file system", async () => {
            jest.advanceTimersByTime(250);

            const actual = await readJsonFileFake(
              "/some-directory-for-lens-local-storage/app.json",
            );

            expect(actual).toEqual({
              sidebar: {
                expanded: { "some-parent-id": true },
                width: 200,
              },
            });
          });
        });
      });
    });
  });
});
