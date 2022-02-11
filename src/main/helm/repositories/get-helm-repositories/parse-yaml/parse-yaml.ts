/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import yaml from "js-yaml";

export interface ParseYamlResult {
  result: LoadYamlResult,
  error: string
}

type LoadYamlResult = object | string | number | null | undefined;

export const parseYaml = (toBeParsed: string): ParseYamlResult => {
  try {
    const result = yaml.load(toBeParsed) as LoadYamlResult;

    return { result, error: null };
  } catch(error) {
    return { result: null, error };
  }
};
