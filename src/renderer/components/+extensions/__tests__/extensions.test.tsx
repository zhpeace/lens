/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "@testing-library/jest-dom/extend-expect";
import { fireEvent, waitFor } from "@testing-library/react";
import fse from "fs-extra";
import React from "react";
import { UserStore } from "../../../../common/user-store";
import type { ExtensionDiscovery } from "../../../../extensions/extension-discovery/extension-discovery";
import type { ExtensionLoader } from "../../../../extensions/extension-loader";
import { ConfirmDialog } from "../../confirm-dialog";
import { Extensions } from "../extensions";
import mockFs from "mock-fs";
import { mockWindow } from "../../../../../__mocks__/windowMock";
import { getDiForUnitTesting } from "../../../getDiForUnitTesting";
import extensionLoaderInjectable from "../../../../extensions/extension-loader/extension-loader.injectable";
import type { DiRender } from "../../test-utils/renderFor";
import { renderFor } from "../../test-utils/renderFor";
import extensionDiscoveryInjectable from "../../../../extensions/extension-discovery/extension-discovery.injectable";
import directoryForUserDataInjectable from "../../../../common/app-paths/directory-for-user-data/directory-for-user-data.injectable";
import directoryForDownloadsInjectable from "../../../../common/app-paths/directory-for-downloads/directory-for-downloads.injectable";
import getConfigurationFileModelInjectable from "../../../../common/get-configuration-file-model/get-configuration-file-model.injectable";
import appVersionInjectable from "../../../../common/get-configuration-file-model/app-version/app-version.injectable";
import type { DownloadJson } from "../../../../common/fetch/download-json.injectable";
import type { DownloadBinary } from "../../../../common/fetch/download-binary.injectable";
import downloadJsonInjectable from "../../../../common/fetch/download-json.injectable";
import downloadBinaryInjectable from "../../../../common/fetch/download-binary.injectable";
import { observable, when } from "mobx";

console.log("This is here as a reminder that mockFs breaks things and needs to be removed");

mockWindow();

jest.mock("fs-extra");
jest.mock("../../notifications");

describe("Extensions", () => {
  let extensionLoader: ExtensionLoader;
  let extensionDiscovery: ExtensionDiscovery;
  let render: DiRender;
  let downloadJson: jest.MockedFunction<DownloadJson>;
  let downloadBinary: jest.MockedFunction<DownloadBinary>;

  beforeEach(async () => {
    const di = getDiForUnitTesting({ doGeneralOverrides: true });

    di.override(directoryForUserDataInjectable, () => "some-directory-for-user-data");
    di.override(directoryForDownloadsInjectable, () => "some-directory-for-downloads");

    di.permitSideEffects(getConfigurationFileModelInjectable);
    di.permitSideEffects(appVersionInjectable);

    mockFs({
      "some-directory-for-user-data": {},
    });

    await di.runSetups();

    render = renderFor(di);

    downloadJson = jest.fn().mockImplementation((url) => { throw new Error(`Unexpected call to downloadJson for url=${url}`); });
    downloadBinary = jest.fn().mockImplementation((url) => { throw new Error(`Unexpected call to downloadJson for url=${url}`); });

    di.override(downloadJsonInjectable, () => downloadJson);
    di.override(downloadBinaryInjectable, () => downloadBinary);

    extensionLoader = di.inject(extensionLoaderInjectable);
    extensionDiscovery = di.inject(extensionDiscoveryInjectable);

    extensionLoader.addExtension({
      id: "extensionId",
      manifest: {
        name: "test",
        version: "1.2.3",
      },
      absolutePath: "/absolute/path",
      manifestPath: "/symlinked/path/package.json",
      isBundled: false,
      isEnabled: true,
      isCompatible: true,
    });

    extensionDiscovery.uninstallExtension = jest.fn(() => Promise.resolve());

    UserStore.createInstance();
  });

  afterEach(() => {
    mockFs.restore();
    UserStore.resetInstance();
  });

  it("disables uninstall and disable buttons while uninstalling", async () => {
    extensionDiscovery.isLoaded = true;

    const res = render(<><Extensions /><ConfirmDialog /></>);
    const table = res.getByTestId("extensions-table");
    const menuTrigger = table.querySelector("div[role=row]:first-of-type .actions .Icon");

    fireEvent.click(menuTrigger);

    expect(await res.findByText("Disable")).toHaveAttribute("aria-disabled", "false");
    expect(await res.findByText("Uninstall")).toHaveAttribute("aria-disabled", "false");

    fireEvent.click(await res.findByText("Uninstall"));

    // Approve confirm dialog
    fireEvent.click(await res.findByText("Yes"));

    await waitFor(async () => {
      expect(extensionDiscovery.uninstallExtension).toHaveBeenCalled();
      fireEvent.click(menuTrigger);
      expect(await res.findByText("Disable")).toHaveAttribute("aria-disabled", "true");
      expect(await res.findByText("Uninstall")).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("disables install button while installing", async () => {
    const res = render(<Extensions />);
    const url = "https://test.extensionurl/package.tgz";

    (fse.unlink as jest.MockedFunction<typeof fse.unlink>).mockReturnValue(Promise.resolve() as any);

    fireEvent.change(res.getByPlaceholderText("File path or URL", {
      exact: false,
    }), {
      target: {
        value: url,
      },
    });

    const doResolve = observable.box(false);

    downloadBinary.mockImplementation(async (targetUrl) => {
      expect(targetUrl).toBe(url);

      await when(() => doResolve.get());

      return {
        status: "error",
        message: "unknown location",
      };
    });

    fireEvent.click(await res.findByText("Install"));
    expect((await res.findByText("Install")).closest("button")).toBeDisabled();
    doResolve.set(true);
  });

  it("displays spinner while extensions are loading", () => {
    extensionDiscovery.isLoaded = false;
    const { container } = render(<Extensions />);

    expect(container.querySelector(".Spinner")).toBeInTheDocument();
  });

  it("does not display the spinner while extensions are not loading", async () => {
    extensionDiscovery.isLoaded = true;
    const { container } = render(<Extensions />);

    expect(container.querySelector(".Spinner")).not.toBeInTheDocument();
  });
});
