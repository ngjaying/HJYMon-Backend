import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
import { schema as monitorSchema } from '../monitor/model'

export Launchy, { schema } from './model'
export Monitor from '../monitor/model'

const router = new Router()
const { launchy } = schema.tree
const { monitor } = monitorSchema.tree

/**
 * @api {post} /launchies Create launchy
 * @apiName CreateLaunchy
 * @apiGroup Launchy
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam launchy Launchy's launchy.
 * @apiSuccess {Object} launchy Launchy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Launchy not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ monitor }),
  create)

/**
 * @api {get} /launchies Retrieve launchies list
 * @apiName RetrieveLaunchies
 * @apiGroup Launchy
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} launchies List of launchies.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /launchies/:id Retrieve launchy run result
 * @apiName RetrieveLaunchy
 * @apiGroup Launchy
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} launchy Launchy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Launchy not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /launchies/:id Update launchy
 * @apiName UpdateLaunchy
 * @apiGroup Launchy
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam launchy Launchy's launchy.
 * @apiSuccess {Object} launchy Launchy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Launchy not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ launchy }),
  update)

/**
 * @api {delete} /launchies/:id Delete launchy
 * @apiName DeleteLaunchy
 * @apiGroup Launchy
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Launchy not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
