/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import currentRouteRegistrationInjectable from "./current-route-registration.injectable";
import currentPageParamsInjectable from "./current-page-params.injectable";
import currentlyInClusterFrameInjectable from "./currently-in-cluster-frame.injectable";

const extensionPageInjectable = getInjectable({
  id: "extension-page",

  instantiate: (di) => {
    const currentRouteRegistration = di.inject(currentRouteRegistrationInjectable);
    const currentPageParams = di.inject(currentPageParamsInjectable);
    const currentlyInClusterFrame = di.inject(currentlyInClusterFrameInjectable);

    return computed(() => {
      const { registration } = currentRouteRegistration.get();

      return {
        Component: registration.components.Page,
        pageParams: currentPageParams.get(),
        shouldRenderTabLayout: currentlyInClusterFrame,
      };
    });
  },
});


export default extensionPageInjectable;
