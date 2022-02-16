/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getDiForUnitTesting } from "../../getDiForUnitTesting";
import rendererExtensionsInjectable from "../../../extensions/renderer-extensions.injectable";
import type {
  EntitySettingRegistration,
} from "../../../extensions/registries";
import { computed, IObservableArray, observable, runInAction } from "mobx";
import { LensRendererExtension } from "../../../extensions/lens-renderer-extension";
import { DiContainer, getInjectable } from "@ogre-tools/injectable";
import entitySettingItemsInjectable, {
  entitySettingRegistrationInjectionToken,
} from "./entity-setting-items.injectable";
import type { CatalogEntity } from "../../../common/catalog";
import React from "react";
import { get, matches } from "lodash/fp";

describe("entity-setting-items", () => {
  let di: DiContainer;
  let registrations: IObservableArray<EntitySettingRegistration>;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    registrations = observable.array();

    di.override(rendererExtensionsInjectable, () =>
      computed(() => [
        new SomeTestExtension({
          id: "some-test-extension-id",
          entitySettings: registrations,
        }),
      ]),
    );

    await di.runSetups();
  });

  it("given registered using injection token, when injecting for an entity, returns items", () => {
    const someInjectable = getInjectable({
      id: "some-entity-setting-registration",

      instantiate: () => ({
        id: "some-registration-id",
        apiVersions: ["some-api-version"],
        kind: "some-kind",
        title: "some-title",

        components: {
          View: () => <div />,
        },
      }),

      injectionToken: entitySettingRegistrationInjectionToken,
    });

    di.register(someInjectable);

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "some-source",
      },
    } as CatalogEntity;

    const items = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    const actual = items.find(matches({ id: "some-registration-id" }));

    expect(actual).toBeDefined();
  });

  it("given registration for different API version, when injecting for an entity, returns no items", () => {
    const registrationStub = {
      id: "some-registration-id",
      apiVersions: ["some-other-api-version"],
      kind: "some-kind",
      title: "some-title",

      components: {
        View: () => <div />,
      },
    };

    runInAction(() => {
      registrations.push(registrationStub);
    });

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "some-source",
      },
    } as CatalogEntity;

    const actual = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    expect(actual.find(matches({ id: "some-registration-id" }))).toBeUndefined();
  });

  it("given registration for different kind, when injecting for an entity, returns no items", () => {
    const registrationStub = {
      id: "some-registration-id",
      apiVersions: ["some-api-version"],
      kind: "some-other-kind",
      title: "some-title",

      components: {
        View: () => <div />,
      },
    };

    runInAction(() => {
      registrations.push(registrationStub);
    });

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "some-source",
      },
    } as CatalogEntity;

    const items = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    expect(items.find(matches({ id: "some-registration-id" }))).toBeUndefined();
  });

  it("given registration for specific source, when injecting for an entity with same source, returns items", () => {
    const registrationStub = {
      id: "some-registration-id",
      apiVersions: ["some-api-version"],
      kind: "some-kind",
      title: "some-title",
      source: "some-source",

      components: {
        View: () => <div />,
      },
    };

    runInAction(() => {
      registrations.push(registrationStub);
    });

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "some-source",
      },
    } as CatalogEntity;

    const items = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    const actual = items.find(matches({ id: "some-registration-id" }));

    expect(actual).toBeDefined();
  });

  it("given registration for specific source, when injecting for an entity with different source, returns items", () => {
    const registrationStub = {
      id: "some-registration-id",
      apiVersions: ["some-api-version"],
      kind: "some-kind",
      title: "some-title",
      source: "some-other-source",

      components: {
        View: () => <div />,
      },
    };

    runInAction(() => {
      registrations.push(registrationStub);
    });

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "some-source",
      },
    } as CatalogEntity;

    const items = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    const actual = items.find(matches({ id: "some-registration-id" }));

    expect(actual).toBeUndefined();
  });

  it("when injecting for an entity without source, returns items without checking for source", () => {
    const registrationStub = {
      id: "some-registration-id",
      apiVersions: ["some-api-version"],
      kind: "some-kind",
      title: "some-title",
      source: "irrelevant",

      components: {
        View: () => <div />,
      },
    };

    runInAction(() => {
      registrations.push(registrationStub);
    });

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: undefined,
      },
    } as CatalogEntity;

    const items = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    const actual = items.find(matches({ id: "some-registration-id" }));

    expect(actual).toBeDefined();
  });

  it("given registration without ID, when injecting for an entity, returns item having lower case title as ID", () => {
    const registrationStub = {
      apiVersions: ["some-api-version"],
      kind: "some-kind",
      title: "Some-title",
      source: "irrelevant",

      components: {
        View: () => <div />,
      },
    };

    runInAction(() => {
      registrations.push(registrationStub);
    });

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: undefined,
      },
    } as CatalogEntity;

    const items = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    const actual = items.find(matches({ id: "some-title" }));

    expect(actual).toBeDefined();
  });

  it("given registrations with priority, when injected, returns registrations in priority order", () => {
    const commonRegistration = {
      apiVersions: ["some-api-version"],
      kind: "some-kind",
      title: "some-title",

      components: {
        View: () => <div />,
      },
    };

    const registrationWithoutPriority = {
      ...commonRegistration,
      id: "registration-without-priority",
    };

    const registrationWithTopPriority = {
      ...commonRegistration,
      id: "registration-with-top-priority",
      priority: 51,
    };

    const registrationWithLowPriority = {
      ...commonRegistration,
      id: "registration-with-low-priority",
      priority: 49,
    };

    runInAction(() => {
      registrations.push(registrationWithLowPriority);
      registrations.push(registrationWithTopPriority);
      registrations.push(registrationWithoutPriority);
    });

    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "irrelevant",
      },
    } as CatalogEntity;

    const items = di.inject(entitySettingItemsInjectable, catalogEntityStub).get();

    expect(items.map(get("id"))).toEqual([
      "registration-with-top-priority",
      "registration-without-priority",
      "registration-with-low-priority",
    ]);
  });

  it("given injecting multiple times for same catalog entity, receives same instance", () => {
    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "some-source",
      },
    } as CatalogEntity;

    const otherCatalogEntityStub = {
      kind: "some-other-kind",
      apiVersion: "some-other-api-version",
      metadata: {
        source: "some-other-source",
      },
    } as CatalogEntity;

    const actual1 = di.inject(entitySettingItemsInjectable, catalogEntityStub);

    di.inject(entitySettingItemsInjectable, otherCatalogEntityStub);

    const actual2 = di.inject(entitySettingItemsInjectable, catalogEntityStub);

    expect(actual1).toBe(actual2);
  });

  it("given injecting multiple times for different catalog entities, receives different instances", () => {
    const catalogEntityStub = {
      kind: "some-kind",
      apiVersion: "some-api-version",
      metadata: {
        source: "some-source",
      },
    } as CatalogEntity;

    const otherCatalogEntityStub = {
      kind: "some-other-kind",
      apiVersion: "some-other-api-version",
      metadata: {
        source: "some-other-source",
      },
    } as CatalogEntity;

    const actual1 = di.inject(entitySettingItemsInjectable, catalogEntityStub);

    const actual2 = di.inject(
      entitySettingItemsInjectable,
      otherCatalogEntityStub,
    );

    expect(actual1).not.toBe(actual2);
  });
});

class SomeTestExtension extends LensRendererExtension {
  constructor({
    id,
    entitySettings,
  }: {
    id: string;
    entitySettings: EntitySettingRegistration[];
  }) {
    super({
      id,
      absolutePath: "irrelevant",
      isBundled: false,
      isCompatible: false,
      isEnabled: false,
      manifest: { name: id, version: "some-version" },
      manifestPath: "irrelevant",
    });

    this.entitySettings = entitySettings;
  }
}
