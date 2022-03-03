/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { DiContainer } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../../getDiForUnitTesting";
import React from "react";
import { fireEvent, RenderResult } from "@testing-library/react";

import { getRendererExtensionFake } from "../test-utils/get-renderer-extension-fake";
import { renderClusterFrameFake } from "../test-utils/render-cluster-frame-fake";
import type { LensRendererExtension } from "../../../extensions/lens-renderer-extension";
import directoryForLensLocalStorageInjectable
  from "../../../common/directory-for-lens-local-storage/directory-for-lens-local-storage.injectable";
import readDirInjectable from "../../../common/fs/read-dir.injectable";
import fse from "fs-extra";
import writeJsonFileInjectable from "../../../common/fs/write-json-file.injectable";

describe("sidebar-items", () => {
  let di: DiContainer;
  let rendered: RenderResult;

  beforeEach(() => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });
    //
    // di.override(readJsonFileInjectable, () => getSafeFrom({
    //   '/some-directory-for-lens-local-storage/app.json': Promise.resolve({})
    // }))
    //
    // di.inject(writeJsonFileInjectable)('/some-directory-for-lens-local-storage/app.json', { asd: 'asd'})
    //
    // // TODO: Add explicit tests for timing of file read
    // di.override(readJsonFileInjectable, () => (filePath) => {
    //   if (filePath !== "/some-directory-for-lens-local-storage/app.json") {
    //     throw new Error(`Missing stub for "${filePath}"`);
    //   }
    //
    //   return Promise.resolve({});
    // });

    di.override(
      directoryForLensLocalStorageInjectable,
      () => "/some-directory-for-lens-local-storage",
    );
  });

  describe("given extension", () => {
    beforeEach(async () => {
      const testExtension = getRendererExtensionFake(extensionStubWithSidebarItems);

      rendered = await renderClusterFrameFake({
        di,
        extensions: [testExtension],
      });
    });

    it("renders", () => {
      expect(rendered.container).toMatchSnapshot();
    });

    it("parent is not highlighted", () => {
      const parent = rendered.getByTestId(
        "sidebar-item-for-some-extension-id-some-parent-id",
      );

      expect(parent.dataset.isActive).toBe("false");
    });

    it("child of parent is not rendered", () => {
      const child = rendered.queryByTestId(
        "sidebar-item-for-some-extension-id-some-child-id",
      );

      expect(child).toBe(null);
    });

    describe("when a parent item is opened", () => {
      beforeEach(() => {
        const parentLink = rendered.getByTestId(
          "sidebar-item-link-for-some-extension-id-some-parent-id",
        );

        fireEvent.click(parentLink);
      });

      it("renders", () => {
        expect(rendered.container).toMatchSnapshot();
      });

      it("parent is not highlighted", () => {
        const parent = rendered.getByTestId(
          "sidebar-item-for-some-extension-id-some-parent-id",
        );

        expect(parent.dataset.isActive).toBe("false");
      });

      it("child of parent is rendered", () => {
        const child = rendered.queryByTestId(
          "sidebar-item-for-some-extension-id-some-child-id",
        );

        expect(child).not.toBe(null);
      });

      describe("when a child of the parent is selected", () => {
        beforeEach(() => {
          const childLink = rendered.getByTestId(
            "sidebar-item-link-for-some-extension-id-some-child-id",
          );

          fireEvent.click(childLink);
        });

        it("renders", () => {
          expect(rendered.container).toMatchSnapshot();
        });

        it("parent is highlighted", () => {
          const parent = rendered.getByTestId(
            "sidebar-item-for-some-extension-id-some-parent-id",
          );

          expect(parent.dataset.isActive).toBe("true");
        });

        it("child is highlighted", () => {
          const child = rendered.getByTestId(
            "sidebar-item-for-some-extension-id-some-child-id",
          );

          expect(child.dataset.isActive).toBe("true");
        });

        it("child page is shown", () => {
          expect(rendered.getByTestId("some-child-page")).not.toBeNull();
        });

        it("renders tabs", () => {
          expect(rendered.getByTestId("tab-layout")).not.toBeNull();
        });

        describe("when selecting sibling tab", () => {
          beforeEach(() => {
            const childTabLink = rendered.getByTestId(
              "tab-link-for-some-extension-id-some-other-child-id",
            );

            fireEvent.click(childTabLink);
          });

          it("renders", () => {
            expect(rendered.container).toMatchSnapshot();
          });

          it("sibling child page is shown", () => {
            expect(
              rendered.getByTestId("some-other-child-page"),
            ).not.toBeNull();
          });

          it("asdasd", async () => {
            const readDir = di.inject(readDirInjectable);
            const writeJson = di.inject(writeJsonFileInjectable);

            await writeJson("/some-directory-for-lens-local-storage/some-directory/some-file", { asd: true });
            await writeJson("/some-directory-for-lens-local-storage/some-directory/some-file2", { asd: true });

            const asd = await readDir("/some-directory-for-lens-local-storage");

            const blaa = await fse.readdir(__dirname);

            console.log(asd);
            expect(asd).toBe("asdasd");
          });
        });
      });
    });
  });
});

const extensionStubWithSidebarItems: Partial<LensRendererExtension> = {
  id: "some-extension-id",

  clusterPages: [
    {
      components: {
        Page: () => {
          throw new Error("should never come here");
        },
      },
    },

    {
      id: "some-child-page-id",

      components: {
        Page: () => (
          <div data-testid="some-child-page">Some child page</div>
        ),
      },
    },

    {
      id: "some-other-child-page-id",

      components: {
        Page: () => (
          <div data-testid="some-other-child-page">
            Some other child page
          </div>
        ),
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
      target: { pageId: "some-child-page-id" },
      parentId: "some-parent-id",
      title: "Child 1",

      components: {
        Icon: null,
      },
    },

    {
      id: "some-other-child-id",
      target: { pageId: "some-other-child-page-id" },
      parentId: "some-parent-id",
      title: "Child 2",

      components: {
        Icon: null,
      },
    },
  ],
};
