/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import glob from "glob";
import {
  join,
  memoize,
  split,
  noop,
  slice,
  filter,
  last,
  map,
  tap,
} from "lodash/fp";
import { createContainer } from "@ogre-tools/injectable";
import { setLegacyGlobalDiForExtensionApi } from "../extensions/as-legacy-globals-for-extension-api/legacy-global-di-for-extension-api";
import getValueFromRegisteredChannelInjectable from "./app-paths/get-value-from-registered-channel/get-value-from-registered-channel.injectable";
import loggerInjectable from "../common/logger.injectable";
import fsInjectable from "../common/fs/fs.injectable";
import type fse from "fs-extra";
import { pipeline } from "@ogre-tools/fp";

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

    di.override(fsInjectable, () => getFsFake());

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

const getFsFake = () => {
  const state = new Map();

  const readFile = (filePath: string) => {
    const fileContent = state.get(filePath);

    if (!fileContent) {
      const existingFilePaths = [...state.keys()].join('", "');

      throw new Error(
        `Tried to access file ${filePath} which does not exist. Existing file paths are: "${existingFilePaths}"`,
      );
    }

    return Promise.resolve(Buffer.from(fileContent));
  };

  return {
    ensureDir: () => Promise.resolve(),

    writeJson: (filePath: string, contents: object) => {
      state.set(filePath, JSON.stringify(contents));

      return Promise.resolve();
    },

    readJson: async (filePath: string) => {
      const fileContent = await readFile(filePath);

      return JSON.parse(fileContent.toString());
    },

    readFile,

    readdir: (directoryPath: string) => {
      const fileNames = pipeline(
        [...state.keys()],

        filter((x) =>
          pipeline(
            x,
            split("/"),
            slice(0, -1),
            join("/"),
          ),
        ),

        tap(console.log),

        map((x) => pipeline(x, split("/"), last)),
      );

      return Promise.resolve(fileNames);
    },
  } as unknown as typeof fse;
};
