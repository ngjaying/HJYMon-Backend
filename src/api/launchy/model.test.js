import { Launchy } from '.'
import { User } from '../user'

let user, launchy

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  launchy = await Launchy.create({ user, monitor: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = launchy.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(launchy.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.monitor).toBe(launchy.monitor)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = launchy.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(launchy.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.monitor).toBe(launchy.monitor)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
