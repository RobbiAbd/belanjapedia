import { describe, expect, it } from 'vitest'
import {
  getQuickReplyMessage,
  getSupportAutoReply,
  SUPPORT_QUICK_REPLIES
} from '#shared/utils/supportChat'

describe('supportChat', () => {
  it('memiliki quick reply bawaan', () => {
    expect(SUPPORT_QUICK_REPLIES.length).toBeGreaterThan(0)
    expect(getQuickReplyMessage('order')).toContain('status pesanan')
  })

  it('membalas pertanyaan status pesanan', () => {
    const reply = getSupportAutoReply('Cek status pesanan saya dong')
    expect(reply).toContain('Pesanan Saya')
  })

  it('membalas pertanyaan coin', () => {
    const reply = getSupportAutoReply('gimana pakai coin?')
    expect(reply).toContain('daily login')
  })

  it('membalas permintaan hubungi CS', () => {
    const reply = getSupportAutoReply('mau hubungi cs')
    expect(reply).toContain('support@belanjapedia.com')
  })
})
