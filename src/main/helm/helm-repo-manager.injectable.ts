/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { HelmRepoManager } from "./helm-repo-manager";

const helmRepoManagerInjectable = getInjectable({
  id: "helm-repo-manager",
  instantiate: () => new HelmRepoManager(),
});

export default helmRepoManagerInjectable;
