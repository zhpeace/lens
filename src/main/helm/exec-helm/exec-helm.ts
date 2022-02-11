/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { HelmCli } from "../helm-cli";
import { promiseExecFile } from "../../../common/utils";
import type { ExecFileOptions } from "child_process";
import type { BaseEncodingOptions } from "fs";
import logger from "../../logger";

interface Dependencies {
  helmCli: HelmCli
}

export const execHelm = ({ helmCli } : Dependencies) =>  async (args: string[], options?: BaseEncodingOptions & ExecFileOptions): Promise<string> => {
  helmCli.setLogger(logger);
  await helmCli.ensureBinary();

  const helmCliPath = await helmCli.binaryPath();

  try {
    const { stdout } = await promiseExecFile(helmCliPath, args, options);

    return stdout;
  } catch (error) {
    throw error?.stderr || error;
  }
};
