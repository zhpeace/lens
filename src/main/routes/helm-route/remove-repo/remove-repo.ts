/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LensApiRequest } from "../../../router";
import type { HelmRepoManager } from "../../../helm/helm-repo-manager";

interface Dependencies {
  helmRepoManager: HelmRepoManager;
}

interface RemoveHelmRepoPayload {
  name: string;
  url: string
}

export const removeRepo =
  ({ helmRepoManager }: Dependencies) =>
    async (request: LensApiRequest<RemoveHelmRepoPayload>) => {
      const { name, url } = request.payload;

      await helmRepoManager.removeRepo({
        name,
        url,
      });

      request.response.end();
    };
