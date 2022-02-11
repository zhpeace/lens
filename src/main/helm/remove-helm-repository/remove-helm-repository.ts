/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import logger from "../../logger";
import type { HelmRepo } from "../get-helm-repositories/read-helm-config/read-helm-config";

interface Dependencies {
  execHelm: (args: string[]) => Promise<any>
}

export const removeHelmRepository = ({ execHelm } : Dependencies) => async (repo: HelmRepo) => {
  logger.info(`[HELM]: removing repo ${repo.name} (${repo.url})`);

  return execHelm([
    "repo",
    "remove",
    repo.name,
  ]);
};
