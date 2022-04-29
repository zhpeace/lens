/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { ExtendableDisposer } from "../../../../common/utils";
import { InputValidators } from "../../input";
import { getMessageFromError } from "../get-message-from-error/get-message-from-error";
import logger from "../../../../main/logger";
import { Notifications } from "../../notifications";
import path from "path";
import React from "react";
import { readFileNotify } from "../read-file-notify/read-file-notify";
import type { AttemptInstallByInfo } from "../attempt-install-by-info/attempt-install-by-info";
import type { ExtensionInstallationStateStore } from "../../../../extensions/extension-installation-state-store/extension-installation-state-store";
import type { AttemptInstall } from "../attempt-install/attempt-install.injectable";
import type { DownloadBinary } from "../../../../common/fetch/download-binary.injectable";
import { withTimeout } from "../../../../common/fetch/timeout-controller";

interface Dependencies {
  attemptInstall: AttemptInstall;
  attemptInstallByInfo: AttemptInstallByInfo;
  extensionInstallationStateStore: ExtensionInstallationStateStore;
  downloadBinary: DownloadBinary;
}

export const installFromInput = ({
  attemptInstall,
  attemptInstallByInfo,
  extensionInstallationStateStore,
  downloadBinary,
}: Dependencies) => async (input: string) => {
  let disposer: ExtendableDisposer | undefined = undefined;

  try {
    // fixme: improve error messages for non-tar-file URLs
    if (InputValidators.isUrl.validate(input)) {
      // install via url
      disposer = extensionInstallationStateStore.startPreInstall();
      const { signal } = withTimeout(10 * 60 * 1000);
      const result = await downloadBinary(input, { signal });

      if (result.status === "error") {
        Notifications.error(`Failed to download extension: ${result.message}`);

        return disposer();
      }

      const fileName = path.basename(input);

      await attemptInstall({ fileName, data: result.data }, disposer);
    } else if (InputValidators.isPath.validate(input)) {
      // install from system path
      const fileName = path.basename(input);
      const data = await readFileNotify(input);

      if (!data) {
        return;
      }

      await attemptInstall({ fileName, data });
    } else if (InputValidators.isExtensionNameInstall.validate(input)) {
      const [{ groups: { name, version }}] = [...input.matchAll(InputValidators.isExtensionNameInstallRegex)];

      await attemptInstallByInfo({ name, version });
    }
  } catch (error) {
    const message = getMessageFromError(error);

    logger.info(`[EXTENSION-INSTALL]: installation has failed: ${message}`, { error, installPath: input });
    Notifications.error(<p>Installation has failed: <b>{message}</b></p>);
  } finally {
    disposer?.();
  }
};
