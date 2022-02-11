/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { execHelm } from "./exec-helm";
import { helmCli } from "../helm-cli";

const execHelmInjectable = getInjectable({
  id: "exec-helm",
  instantiate: () => execHelm({ helmCli }),
});

export default execHelmInjectable;
