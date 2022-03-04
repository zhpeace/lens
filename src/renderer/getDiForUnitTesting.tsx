/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import glob from "glob";
import { memoize, noop } from "lodash/fp";
import { createContainer } from "@ogre-tools/injectable";
import { setLegacyGlobalDiForExtensionApi } from "../extensions/as-legacy-globals-for-extension-api/legacy-global-di-for-extension-api";
import getValueFromRegisteredChannelInjectable from "./app-paths/get-value-from-registered-channel/get-value-from-registered-channel.injectable";
import loggerInjectable from "../common/logger.injectable";
import { overrideFsWithFakes } from "../test-utils/override-fs-with-fakes";
import observableHistoryInjectable from "./navigation/observable-history.injectable";
import { searchParamsOptions } from "./navigation";
import { createMemoryHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";

export const getDiForUnitTesting = (
  { doGeneralOverrides } = { doGeneralOverrides: false },
) => {
  const di = createContainer();

  setLegacyGlobalDiForExtensionApi(di);

  for (const filePath of getInjectableFilePaths()) {
    const injectableInstance = require(filePath).default;

    di.register({
      ...injectableInstance,
      aliases: [injectableInstance, ...(injectableInstance.aliases || [])],
    });
  }

  di.preventSideEffects();

  if (doGeneralOverrides) {
    di.override(getValueFromRegisteredChannelInjectable, () => () => undefined);

    overrideFsWithFakes(di);

    di.override(observableHistoryInjectable, () => {
      const historyFake = createMemoryHistory();

      return createObservableHistory(historyFake, {
        searchParams: searchParamsOptions,
      });
    });

    di.override(loggerInjectable, () => ({
      warn: noop,
      debug: noop,
      log: noop,
      error: (...args: any) => console.error(...args),
      info: noop,
    }));
  }

  return di;
};

const getInjectableFilePaths = memoize(() => [
  ...glob.sync("./**/*.injectable.{ts,tsx}", { cwd: __dirname }),
  ...glob.sync("../common/**/*.injectable.{ts,tsx}", { cwd: __dirname }),
  ...glob.sync("../extensions/**/*.injectable.{ts,tsx}", { cwd: __dirname }),
]);
