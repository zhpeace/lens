/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { DiContainer } from "@ogre-tools/injectable";
import readFileInjectable from "../common/fs/read-file.injectable";
import writeJsonFileInjectable from "../common/fs/write-json-file.injectable";
import readJsonFileInjectable from "../common/fs/read-json-file.injectable";
import pathExistsInjectable from "../common/fs/path-exists.injectable";

export const overrideFsWithFakes = (di: DiContainer) => {
  const state = new Map();

  const readFile = readFileFor(state);

  const overrides = [
    {
      injectableToOverride: readFileInjectable,

      instantiateFake: () => readFile,
    },

    {
      injectableToOverride: writeJsonFileInjectable,

      instantiateFake: () => (filePath: string, contents: object) => {
        state.set(filePath, JSON.stringify(contents));

        return Promise.resolve();
      },
    },

    {
      injectableToOverride: readJsonFileInjectable,

      instantiateFake: () => async (filePath: string) => {
        const fileContent = await readFile(filePath);

        return JSON.parse(fileContent.toString());
      },
    },

    {
      injectableToOverride: pathExistsInjectable,

      instantiateFake: () => async (filePath: string) =>
        Promise.resolve(state.has(filePath)),
    },
  ];

  overrides.forEach(({ injectableToOverride, instantiateFake }) => {
    di.override(injectableToOverride, instantiateFake);
  });
};

const readFileFor = (state: Map<string, Buffer>) => (filePath: string) => {
  const fileContent = state.get(filePath);

  if (!fileContent) {
    const existingFilePaths = [...state.keys()].join('", "');

    throw new Error(
      `Tried to access file ${filePath} which does not exist. Existing file paths are: "${existingFilePaths}"`,
    );
  }

  return Promise.resolve(Buffer.from(fileContent));
};
