/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { HelmRepo } from "../../../helm/helm-repo-manager";
import type { LensApiRequest } from "../../../router";
import { respondJson } from "../../../utils/http-responses";

interface Dependencies {
  getRepositories: () => Promise<HelmRepo[]>
}

export const listRepos = ({ getRepositories }: Dependencies) => async (request: LensApiRequest) => {
  const repositories = await getRepositories();

  respondJson(request.response, repositories);
};
