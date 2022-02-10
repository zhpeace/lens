/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { listRepos } from "./list-repos";
import getRepositoriesInjectable from "../../../helm/get-repositories.injectable";
import { routeInjectionToken } from "../../../router/router.injectable";
import { apiPrefix } from "../../../../common/vars";

const listReposInjectable = getInjectable({
  id: "helm-route-list-repos",

  instantiate: (di) => ({
    method: "get",
    path: `${apiPrefix}/v2/repos`,

    handler: listRepos({
      getRepositories: di.inject(getRepositoriesInjectable),
    }),
  }),

  injectionToken: routeInjectionToken,
});

export default listReposInjectable;
