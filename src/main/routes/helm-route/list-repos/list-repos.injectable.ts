/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import getHelmRepositoriesInjectable from "../../../helm/get-helm-repositories/get-helm-repositories.injectable";
import { routeInjectionToken } from "../../../router/router.injectable";
import { apiPrefix } from "../../../../common/vars";
import type { LensApiRequest } from "../../../router";
import { respondJson } from "../../../utils/http-responses";

const listReposInjectable = getInjectable({
  id: "helm-route-list-repos",

  instantiate: (di) => {
    const getHelmRepositories = di.inject(getHelmRepositoriesInjectable);

    return {
      method: "get",
      path: `${apiPrefix}/v2/repos`,

      handler: async (request: LensApiRequest) => {
        const repositories = await getHelmRepositories();

        respondJson(request.response, repositories);
      },
    };
  },

  injectionToken: routeInjectionToken,
});

export default listReposInjectable;
