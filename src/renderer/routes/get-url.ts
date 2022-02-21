/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Route } from "./all-routes.injectable";
import { compile } from "path-to-regexp";

interface Parameters {
  query?: {},
  path?: {}
  fragment?: string
}

export const getUrl = (route: Route, parameters: Parameters = {}) => {
  const queryParameters = parameters.query || {};
  const pathParameters = parameters.path || {};
  const fragment = parameters.fragment || {};

  const pathBuilder = compile(String(route.path));

  const queryString = queryParameters ? new URLSearchParams(Object.entries(queryParameters)).toString() : null;

  const parts = [
    pathBuilder(pathParameters),
    queryString && `?${queryString}`,
    fragment && `#${fragment}`,
  ];

  return parts.filter(Boolean).join("");
};


