import { Router } from 'express';

import {
  getArtsProducersNumber,
  getArtsProducersTrending,
  getArtsSubmissionMetrics,
  getChatMessagesByRaid,
  getChatMessagesMetrics,
  getLinksAccessMetrics,
  getLinksAccessTrending,
  getRaidAccessMetrics,
  getRaidAccessTrending,
  getVisitsByCountry,
  getVisitsMetrics,
  registerArtSubmission,
  registerChatMessage,
  registerChatMessageInRaid,
  registerLinkAccess,
  registerRaidAccess,
  registerVisit,
} from '@/controllers/metrics/index.js';

const router = Router();

// Visits (Acessos ao site)
router.post('/visits', registerVisit);
router.get('/visits', getVisitsMetrics);
router.get('/visits/countries', getVisitsByCountry);

// Raids (Acessos e mensagens)
router.post('/raids', registerRaidAccess);
router.get('/raids', getRaidAccessMetrics);
router.get('/raids/trending', getRaidAccessTrending);

// Links (Acessos a links)
router.post('/links', registerLinkAccess);
router.get('/links', getLinksAccessMetrics);
router.get('/links/trending', getLinksAccessTrending);

// Chat (Mensagens trocadas com o bot)
router.post('/chat', registerChatMessage);
router.get('/chat', getChatMessagesMetrics);
router.post('/chat/raid-message', registerChatMessageInRaid);
router.get('/chat/raid-message', getChatMessagesByRaid);

// Arts (Envio de artes e métricas relacionadas)
router.post('/arts', registerArtSubmission);
router.get('/arts', getArtsSubmissionMetrics);
router.get('/arts/producers', getArtsProducersNumber);
router.get('/arts/producers/trending', getArtsProducersTrending);

export { router as metricsRoutes };
