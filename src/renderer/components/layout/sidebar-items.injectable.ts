/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
// @ts-ignore
import { pipeline } from "@ogre-tools/fp";

import {
  filter,
  flatMap,
  identity,
  invokeMap,
  isEmpty,
  map,
  overSome,
  some,
} from "lodash/fp";
import rendererExtensionsInjectable from "../../../extensions/renderer-extensions.injectable";
import type { LensRendererExtension } from "../../../extensions/lens-renderer-extension";

export interface SidebarItemRegistration {
  id: string;
  parentId: string | null;
  title: string;
  onClick: () => void;
  getIcon?: () => React.ReactNode;
  isActive?: IComputedValue<boolean>;
  isVisible?: boolean;
  priority: number;
  extension?: LensRendererExtension;
}

export const sidebarItemsInjectionToken = getInjectionToken<
  IComputedValue<SidebarItemRegistration[]>
>({ id: "sidebar-items-injection-token" });

export interface HierarchicalSidebarItem {
  item: SidebarItemRegistration;
  children: HierarchicalSidebarItem[];
  isActive: IComputedValue<boolean>;
}

const sidebarItemsInjectable = getInjectable({
  id: "sidebar-items",

  instantiate: (di) => {
    const extensions = di.inject(rendererExtensionsInjectable);

    return computed((): HierarchicalSidebarItem[] => {
      const enabledExtensions = extensions.get();

      const sidebarItemRegistrations = di.injectMany(
        sidebarItemsInjectionToken,
      );

      const registrations = pipeline(
        sidebarItemRegistrations,
        flatMap(dereference),

        filter(
          overSome([
            isNonExtensionSidebarItem,
            isEnabledExtensionSidebarItemFor(enabledExtensions),
          ]),
        ),
      );

      const getSidebarItemsHierarchy = (
        registrations: SidebarItemRegistration[],
      ) => {
        const _getSidebarItemsHierarchy = (
          parentId: string,
        ): HierarchicalSidebarItem[] =>
          pipeline(
            registrations,

            filter((item) => item.parentId === parentId),

            map((item) => {
              const children = _getSidebarItemsHierarchy(item.id);

              return {
                item,
                children,

                isActive: computed(() => {
                  if (isEmpty(children)) {
                    return item.isActive ? item.isActive.get() : false;
                  }

                  return pipeline(
                    children,
                    invokeMap("isActive.get"),
                    some(identity),
                  );
                }),
              };
            }),
          );

        return _getSidebarItemsHierarchy(null);
      };

      return getSidebarItemsHierarchy(registrations);

      // return pipeline(
      //   registrations,
      //   map(asParents(registrations)),
      //   filter((item) => item.isVisible),
      //   (items) => orderBy(["priority", "title"], ["asc", "asc"], items),
      // );
    });
  },
});

const isNonExtensionSidebarItem = (sidebarItem: SidebarItemRegistration) =>
  !sidebarItem.extension;

const isEnabledExtensionSidebarItemFor =
  (enabledExtensions: LensRendererExtension[]) =>
    (sidebarItem: SidebarItemRegistration) =>
      !!enabledExtensions.find((x) => x === sidebarItem.extension);

const dereference = (items: IComputedValue<SidebarItemRegistration[]>) =>
  items.get();

// type StrictItemRegistration = SetRequired<
//   SidebarItemRegistration,
//   "isActive" | "isVisible"
// >;

// const asParents =
//   (allItems: SidebarItemRegistration[]) =>
//     (item: SidebarItemRegistration): StrictItemRegistration => {
//       const children = allItems.filter(matches({ parentId: item.id }));
//
//       if (isEmpty(children)) {
//         return { isActive: false, isVisible: true, ...item };
//       }
//
//       return {
//         isActive: some({ isActive: true }, children),
//         isVisible: true, // some({ isVisible: true }, children),
//         ...item,
//       };
//     };

export default sidebarItemsInjectable;
