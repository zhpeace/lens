/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { removeRepo } from "./remove-repo";
import { routeInjectionToken } from "../../../router/router.injectable";
import { apiPrefix } from "../../../../common/vars";
import helmRepoManagerInjectable from "../../../helm/helm-repo-manager.injectable";

const removeRepoInjectable = getInjectable({
  id: "helm-route-remove-repo",

  instantiate: (di) => ({
    method: "delete",
    path: `${apiPrefix}/v2/repos`,

    handler: removeRepo({
      helmRepoManager: di.inject(helmRepoManagerInjectable),
    }),
  }),

  injectionToken: routeInjectionToken,
});

export default removeRepoInjectable;
