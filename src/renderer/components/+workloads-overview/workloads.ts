/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { computed, IComputedValue } from "mobx";
import type { KubeResource } from "../../../common/rbac";
import type { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";
import type { KubeObject } from "../../../common/k8s-api/kube-object";
import { workloadURL } from "../../../common/routes";
import { ResourceNames } from "../../utils/rbac";
import type { NamespaceStore } from "../+namespaces/namespace-store/namespace.store";

interface Dependencies {
  namespaceStore: NamespaceStore;

  kubeResources: ({
    resourceName: KubeResource;
    store: KubeObjectStore<KubeObject>;
    isAllowed: IComputedValue<boolean>;
  })[];
}

export const workloads = ({
  kubeResources,
  namespaceStore,
}: Dependencies) =>
  computed(() =>
    kubeResources
      .filter(x => x.isAllowed.get())
      .map(({ resourceName, store }) => {
        const items = store.getAllByNs(namespaceStore.contextNamespaces);

        return {
          resource: resourceName,
          href: workloadURL[resourceName](),
          amountOfItems: items.length,
          status: store.getStatuses(items),
          title: ResourceNames[resourceName],
        };
      }),
  );
