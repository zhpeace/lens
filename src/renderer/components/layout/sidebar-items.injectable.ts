/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
// @ts-ignore
import { pipeline } from "@ogre-tools/fp";

import {
  defaults,
  filter,
  flatMap,
  isEmpty,
  map,
  matches,
  orderBy,
  some,
} from "lodash/fp";
import type { SetRequired } from "type-fest";
import type { SidebarItemProps } from "./sidebar-item";

export interface SidebarItemRegistration {
  id: string;
  parentId: string | null
  title: string;
  onClick: () => void;
  getIcon?: () => React.ReactNode
  isActive?: boolean
  isVisible?: boolean
  priority: number
}

export const sidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<SidebarItemRegistration[]>
>({ id: "sidebar-items-injection-token" });

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    const sidebarItemRegistrations = di.injectMany(sidebarItemsInjectionToken);

    // const extensionSidebarItemRegistrations = di.inject(
    //   extensionSidebarItemRegistrationsInjectable,
    // );

    return computed((): SidebarItemProps[] => {
      const registrations = pipeline(
        sidebarItemRegistrations,
        flatMap(dereference),
        map(defaults({ isVisible: true, isActive: true })),
      );

      return pipeline(
        registrations,
        map(asParents(registrations)),
        filter((item) => item.isVisible),
        (items) => orderBy(["priority", "title"], ["asc", "asc"], items),
      );
    });
  },
});

const dereference = (items: IComputedValue<SidebarItemRegistration[]>) => items.get();

type StrictItemRegistration = SetRequired<SidebarItemRegistration, "isActive" | "isVisible">;

const asParents = (allItems: SidebarItemRegistration[]) => (item: StrictItemRegistration): StrictItemRegistration => {
  const children = allItems.filter(matches({ parentId: item.id }));

  if (isEmpty(children)) {
    return item;
  }

  return {
    ...item,
    isActive: some({ isActive: true }, children),
    isVisible: some({ isVisible: true }, children),
  };
};

export default sidebarItemsInjectable;
