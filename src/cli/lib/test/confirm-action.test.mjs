/* global beforeAll describe expect jest test */

import { confirmAction } from '../confirm-action'

import { Questioner } from '@liquid-labs/question-and-answer'

jest.mock('@liquid-labs/question-and-answer')

describe('confirmAction', () => {
  test("returns true immediately without interrogation when 'confirm = true'", async() => {
    const questioner = { question : jest.fn() }
    Questioner.mockReturnValue(questioner)
    const result = await confirmAction({ confirm : true })
    expect(result).toBe(true)
    expect(questioner.question.mock.calls).toHaveLength(0)
  })

  test("raises exception immediately without interrogation when 'confirm = false'", async() => {
    const questioner = { question : jest.fn() }
    Questioner.mockReturnValue(questioner)
    try {
      await confirmAction({ actionDescription : 'foo', confirm : false })
      throw new Error('conformAction confirm=falsse did not throw as expected.')
    }
    catch (e) {
      expect(questioner.question.mock.calls).toHaveLength(0)
      expect(e.message).toMatch(/Foo cancelled./)
    }
  })

  describe("when 'confirm' is undefined", () => {
    const questioner = {
      question : jest.fn(),
      get      : jest.fn().mockReturnValue(true)
    }
    let result

    beforeAll(async() => {
      Questioner.mockReturnValue(questioner)
      result = await confirmAction({ actionDescription : 'foo' })
    })

    test("invokes 'question'", () => expect(questioner.question.mock.calls).toHaveLength(1))
    test('true answer resolves to true', () => expect(result).toBe(true))
  })

  test("when 'confirm' is undefined, false answer results in exception ", async() => {
    const questioner = {
      question : jest.fn(),
      get      : jest.fn().mockReturnValue(false)
    }

    Questioner.mockReturnValue(questioner)
    try {
      await confirmAction({ actionDescription : 'foo' })
      throw new Error("'confirmAction' (false) did not throw as expected")
    }
    catch (e) {
      expect(e.message).toMatch(/Foo cancelled./)
    }
  })
})
