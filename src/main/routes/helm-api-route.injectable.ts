/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import helmServiceInjectable from "../helm/helm-service.injectable";
import { HelmApiRoute } from "./helm-route";

const helmApiRouteInjectable = getInjectable({
  id: "helm-api-route",

  instantiate: (di) =>
    new HelmApiRoute({
      helmService: di.inject(helmServiceInjectable),
    }),
});

export default helmApiRouteInjectable;
