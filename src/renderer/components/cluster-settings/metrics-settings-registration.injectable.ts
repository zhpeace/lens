/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import * as clusterSettings from "./index";
import { entitySettingRegistrationInjectionToken } from "../+entity-settings/entity-setting-items.injectable";

const metricsSettingsRegistrationInjectable = getInjectable({
  id: "metrics-settings-registration",

  instantiate: () => ({
    apiVersions: ["entity.k8slens.dev/v1alpha1"],
    kind: "KubernetesCluster",
    title: "Metrics",
    group: "Settings",
    components: {
      View: clusterSettings.MetricsSettings,
    },
  }),

  injectionToken: entitySettingRegistrationInjectionToken,
});

export default metricsSettingsRegistrationInjectable;
