/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../../router/router.injectable";
import { apiPrefix } from "../../../../common/vars";
import removeHelmRepositoryInjectable from "../../../helm/remove-helm-repository/remove-helm-repository.injectable";
import type { LensApiRequest } from "../../../router";
import type { HelmRepo } from "../../../../common/helm-repo";

const removeRepoInjectable = getInjectable({
  id: "helm-route-remove-repo",

  instantiate: (di) => {
    const removeHelmRepository = di.inject(removeHelmRepositoryInjectable);

    return {
      method: "delete",
      path: `${apiPrefix}/v2/repos`,

      handler: async (request: LensApiRequest<HelmRepo>) => {
        const repo = request.payload;

        await removeHelmRepository(repo);

        request.response.end();
      },
    };
  },

  injectionToken: routeInjectionToken,
});

export default removeRepoInjectable;
