/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../../router/router.injectable";
import { apiPrefix } from "../../../../common/vars";
import type { LensApiRequest } from "../../../router";
import addHelmRepositoryInjectable from "../../../helm/add-helm-repository/add-helm-repository.injectable";
import type {
  HelmRepo,
} from "../../../helm/get-helm-repositories/read-helm-config/read-helm-config";

const addRepoInjectable = getInjectable({
  id: "helm-route-add-repo",

  instantiate: (di) => {
    const addHelmRepository = di.inject(addHelmRepositoryInjectable);

    return {
      method: "post",
      path: `${apiPrefix}/v2/repos`,

      handler: async (request: LensApiRequest<HelmRepo>) => {
        const repo = request.payload;

        await addHelmRepository(repo);

        request.response.end();
      },
    };
  },

  injectionToken: routeInjectionToken,
});

export default addRepoInjectable;
