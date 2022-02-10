/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import helmRepoManagerInjectable from "./helm-repo-manager.injectable";

const getRepositoriesInjectable = getInjectable({
  id: "get-repositories",
  instantiate: (di) => di.inject(helmRepoManagerInjectable).repositories,
});

export default getRepositoriesInjectable;
