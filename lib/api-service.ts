/**
 * Central API Service for OCTO Mobile Admin Dashboard.
 * [REFAC] Delegated to highly modular sub-services under lib/services/ to avoid oversized files.
 * Maintains backward compatibility for existing dashboard components.
 */

import { AuthService } from "./services/auth-service";
import { FeatureService } from "./services/feature-service";
import { SegmentService } from "./services/segment-service";
import { ABTestingService } from "./services/ab-testing-service";
import { ConsentService } from "./services/consent-service";
import { LogService } from "./services/log-service";
import { ModelService } from "./services/model-service";

export const ApiService = {
  // Auth
  login: AuthService.login,
  register: AuthService.register,

  // Feature Analytics
  getFeaturesUsage: FeatureService.getFeaturesUsage,
  getFeatureDetails: FeatureService.getFeatureDetails,
  getFeatureTrend: FeatureService.getFeatureTrend,
  getTopFeatures: FeatureService.getTopFeatures,

  // Segments & Personas
  getPersonaDistribution: SegmentService.getPersonaDistribution,
  getClusterDistribution: SegmentService.getClusterDistribution,
  getSegmentTrend: SegmentService.getSegmentTrend,
  getClusterTrend: SegmentService.getClusterTrend,

  // A/B Testing
  getCTR: ABTestingService.getCTR,
  getCTRByGroup: ABTestingService.getCTRByGroup,
  getABGroups: ABTestingService.getABGroups,

  // Consent (New)
  getConsents: ConsentService.getConsents,
  getConsentSummary: ConsentService.getConsentSummary,
  getConsentTrend: ConsentService.getConsentTrend,

  // Logs (New)
  getLogs: LogService.getLogs,
  createLog: LogService.createLog,

  // Models (New)
  getModels: ModelService.getModels,
  createModel: ModelService.createModel,
  updateModel: ModelService.updateModel,
};
