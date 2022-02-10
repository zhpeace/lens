/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LensApiRequest } from "../../../router";
import type { HelmRepoManager } from "../../../helm/helm-repo-manager";

interface Dependencies {
  helmRepoManager: HelmRepoManager;
}

interface AddHelmRepoPayload {
  name: string;
  url: string;
}

export const addRepo =
  ({ helmRepoManager }: Dependencies) =>
    async (request: LensApiRequest<AddHelmRepoPayload>) => {
      const { name, url } = request.payload;

      await helmRepoManager.addRepo({
        name,
        url,
      });

      request.response.end();
    };
