/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { HelmService } from "./helm-service";
import getRepositoryInjectable from "./get-repository.injectable";
import getRepositoriesInjectable from "./get-repositories.injectable";

const helmServiceInjectable = getInjectable({
  id: "helm-service",

  instantiate: (di) => new HelmService({
    getRepository: di.inject(getRepositoryInjectable),
    getRepositories: di.inject(getRepositoriesInjectable),
  }),
});

export default helmServiceInjectable;
