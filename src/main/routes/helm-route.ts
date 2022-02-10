/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { LensApiRequest } from "../router";
import type { HelmService } from "../helm/helm-service";
import logger from "../logger";
import { respondJson, respondText } from "../utils/http-responses";
import { getBoolean } from "../utils/parse-query";

interface Dependencies {
  helmService: HelmService
}

export class HelmApiRoute {
  constructor(private dependencies: Dependencies) {}

  async listCharts(request: LensApiRequest) {
    const { response } = request;
    const charts = await this.dependencies.helmService.listCharts();

    respondJson(response, charts);
  }

  async getChart(request: LensApiRequest) {
    const { params, query, response } = request;

    try {
      const chart = await this.dependencies.helmService.getChart(params.repo, params.chart, query.get("version"));

      respondJson(response, chart);
    } catch (error) {
      respondText(response, error?.toString() || "Error getting chart", 422);
    }
  }

  async getChartValues(request: LensApiRequest) {
    const { params, query, response } = request;

    try {
      const values = await this.dependencies.helmService.getChartValues(params.repo, params.chart, query.get("version"));

      respondJson(response, values);
    } catch (error) {
      respondText(response, error?.toString() || "Error getting chart values", 422);
    }
  }

  async installChart(request: LensApiRequest) {
    const { payload, cluster, response } = request;

    try {
      const result = await this.dependencies.helmService.installChart(cluster, payload);

      respondJson(response, result, 201);
    } catch (error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error installing chart", 422);
    }
  }

  async updateRelease(request: LensApiRequest) {
    const { cluster, params, payload, response } = request;

    try {
      const result = await this.dependencies.helmService.updateRelease(cluster, params.release, params.namespace, payload );

      respondJson(response, result);
    } catch (error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error updating chart", 422);
    }
  }

  async rollbackRelease(request: LensApiRequest) {
    const { cluster, params, payload, response } = request;

    try {
      await this.dependencies.helmService.rollback(cluster, params.release, params.namespace, payload.revision);

      response.end();
    } catch (error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error rolling back chart", 422);
    }
  }

  async listReleases(request: LensApiRequest) {
    const { cluster, params, response } = request;

    try {
      const result = await this.dependencies.helmService.listReleases(cluster, params.namespace);

      respondJson(response, result);
    } catch(error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error listing release", 422);
    }
  }

  async getRelease(request: LensApiRequest) {
    const { cluster, params, response } = request;

    try {
      const result = await this.dependencies.helmService.getRelease(cluster, params.release, params.namespace);

      respondJson(response, result);
    } catch (error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error getting release", 422);
    }
  }

  async getReleaseValues(request: LensApiRequest) {
    const { cluster, params: { namespace, release }, response, query } = request;
    const all = getBoolean(query, "all");

    try {
      const result = await this.dependencies.helmService.getReleaseValues(release, { cluster, namespace, all });

      respondText(response, result);
    } catch (error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error getting release values", 422);
    }
  }

  async getReleaseHistory(request: LensApiRequest) {
    const { cluster, params, response } = request;

    try {
      const result = await this.dependencies.helmService.getReleaseHistory(cluster, params.release, params.namespace);

      respondJson(response, result);
    } catch (error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error getting release history", 422);
    }
  }

  async deleteRelease(request: LensApiRequest) {
    const { cluster, params, response } = request;

    try {
      const result = await this.dependencies.helmService.deleteRelease(cluster, params.release, params.namespace);

      respondJson(response, result);
    } catch (error) {
      logger.debug(error);
      respondText(response, error?.toString() || "Error deleting release", 422);
    }
  }
}
