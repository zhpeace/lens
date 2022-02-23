/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import type { ISidebarItem } from "./sidebar";
import extensionSidebarItemRegistrationsInjectable from "./extension-sidebar-item-registrations.injectable";
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

interface Pipeline {
  <A, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
    arg: A,
    f1: (arg: A) => R1,
    f2: (arg: R1) => R2,
    f3: (arg: R2) => R3,
    f4: (arg: R3) => R4,
    f5: (arg: R4) => R5,
    f6: (arg: R5) => R6,
    f7: (arg: R6) => R7,
    f8: (arg: R7) => R8,
    f9: (arg: R8) => R9
  ): R9;
  <A, R1, R2, R3, R4, R5, R6, R7, R8>(
    arg: A,
    f1: (arg: A) => R1,
    f2: (arg: R1) => R2,
    f3: (arg: R2) => R3,
    f4: (arg: R3) => R4,
    f5: (arg: R4) => R5,
    f6: (arg: R5) => R6,
    f7: (arg: R6) => R7,
    f8: (arg: R7) => R8
  ): R8;
  <A, R1, R2, R3, R4, R5, R6, R7>(
    arg: A,
    f1: (arg: A) => R1,
    f2: (arg: R1) => R2,
    f3: (arg: R2) => R3,
    f4: (arg: R3) => R4,
    f5: (arg: R4) => R5,
    f6: (arg: R5) => R6,
    f7: (arg: R6) => R7
  ): R7;
  <A, R1, R2, R3, R4, R5, R6>(
    arg: A,
    f1: (arg: A) => R1,
    f2: (arg: R1) => R2,
    f3: (arg: R2) => R3,
    f4: (arg: R3) => R4,
    f5: (arg: R4) => R5,
    f6: (arg: R5) => R6
  ): R6;
  <A, R1, R2, R3, R4, R5>(
    arg: A,
    f1: (arg: A) => R1,
    f2: (arg: R1) => R2,
    f3: (arg: R2) => R3,
    f4: (arg: R3) => R4,
    f5: (arg: R4) => R5
  ): R5;
  <A, R1, R2, R3, R4>(
    arg: A,
    f1: (arg: A) => R1,
    f2: (arg: R1) => R2,
    f3: (arg: R2) => R3,
    f4: (arg: R3) => R4
  ): R4;
  <A, R1, R2, R3>(
    arg: A,
    f1: (arg: A) => R1,
    f2: (arg: R1) => R2,
    f3: (arg: R2) => R3
  ): R3;
  <A, R1, R2>(arg: A, f1: (arg: A) => R1, f2: (arg: R1) => R2): R2;
  <A, R1>(arg: A, f1: (arg: A) => R1): R1;
}

const mikkoPipeline: Pipeline = pipeline;

export const sidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<ISidebarItem[]>
>({ id: "sidebar-items-injection-token" });

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    const sidebarItemRegistrations = di.injectMany(sidebarItemsInjectionToken);

    const extensionSidebarItemRegistrations = di.inject(
      extensionSidebarItemRegistrationsInjectable,
    );

    return computed((): ISidebarItem[] => {
      const registrations = mikkoPipeline(
        [...sidebarItemRegistrations, extensionSidebarItemRegistrations],
        flatMap(dereference),
      );

      return mikkoPipeline(
        registrations,
        map(asParents(registrations)),
        map(defaults({ isVisible: true })),
        filter((item) => item.isVisible),
        (items) => orderBy(["priority", "title"], ["asc", "asc"], items),
      );
    });
  },
});

const dereference = (items: IComputedValue<ISidebarItem[]>) => items.get();

const asParents = (allItems: ISidebarItem[]) => (item: ISidebarItem) => {
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
