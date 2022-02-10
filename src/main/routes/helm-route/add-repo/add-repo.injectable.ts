/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { addRepo } from "./add-repo";
import { routeInjectionToken } from "../../../router/router.injectable";
import { apiPrefix } from "../../../../common/vars";
import helmRepoManagerInjectable from "../../../helm/helm-repo-manager.injectable";

const addRepoInjectable = getInjectable({
  id: "helm-route-add-repo",

  instantiate: (di) => ({
    method: "post",
    path: `${apiPrefix}/v2/repos`,

    handler: addRepo({
      helmRepoManager: di.inject(helmRepoManagerInjectable),
    }),
  }),

  injectionToken: routeInjectionToken,
});

export default addRepoInjectable;
