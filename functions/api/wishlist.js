
import {
  verifySession,
  json,
} from '../../server/auth.js'

import { gifts } from '../../src/data/gifts.js'

import {
  MAX_GIFTS,
  getGiftCount,
} from '../../src/utils/giftUtils.js'

export async function onRequestPost({ request, env }) {
  try {
    // Prevent cross-origin submissions
    if (
      request.headers.get('Origin') !==
      new URL(request.url).origin
    ) {
      return json({ error: 'Forbidden' }, 403)
    }

    // Require an authenticated session
    const authenticated = await verifySession(
      request,
      env.SESSION_SECRET
    )

    if (!authenticated) {
      return json({
        error: 'Please log in again.',
      }, 401)
    }

    // Receive wishlist selections
    const { selections } = await request.json()

    if (
      !Array.isArray(selections) ||
      selections.length === 0 ||
      selections.length > MAX_GIFTS
    ) {
      return json({
        error: 'Invalid wishlist selections.',
      }, 400)
    }

    const validatedGifts = []
    const selectedIds = new Set()
    let total = 0

    // Validate each selected gift
    for (const selection of selections) {
      if (!selection || typeof selection !== 'object') {
        return json({
          error: 'Invalid selection.',
        }, 400)
      }

      const {
        id,
        color,
        format,
        custom = null,
      } = selection

      const gift = gifts.find(item => item.id === id)

      if (!gift || selectedIds.has(id)) {
        return json({
          error: 'Invalid or duplicate gift.',
        }, 400)
      }

      selectedIds.add(id)

      // Validate metal color
      if (!gift.colors.includes(color)) {
        return json({
          error: 'Invalid gift color.',
        }, 400)
      }

      // Validate format
      if (!gift.formats.includes(format)) {
        return json({
          error: 'Invalid gift format.',
        }, 400)
      }

      // Validate custom options
      const customs = gift.customs || []

      const isOriented =
        customs.includes('left') ||
        customs.includes('right')

      const availableCustoms =
        isOriented && format === 'pair'
          ? []
          : customs

      if (
        availableCustoms.length > 0
          ? !availableCustoms.includes(custom)
          : custom !== null
      ) {
        return json({
          error: 'Invalid gift customization.',
        }, 400)
      }

      const quantity = getGiftCount(format)

      total += quantity

      validatedGifts.push({
        name: gift.name,
        color,
        format,
        custom,
        quantity,
        productUrl: gift.productUrl,
      })
    }

    // Enforce gift limit on the server
    if (total < 1 || total > MAX_GIFTS) {
      return json({
        error: `Please select between 1 and ${MAX_GIFTS} gifts.`,
      }, 400)
    }

    // Check Formspree configuration
    if (!/^[a-zA-Z0-9]+$/.test(env.FORMSPREE_ID || '')) {
      return json({
        error: 'Wishlist delivery is not configured yet.',
      }, 503)
    }

    // Capitalize option labels
    function capitalize(value) {
      return String(value)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
    }

    // Format the email contents
    const wishlist = validatedGifts
      .map((gift, index) => {
        return [
          `${index + 1}. ${gift.name}`,
          `Metal: ${capitalize(gift.color)}`,
          `Format: ${capitalize(gift.format)}`,
          gift.custom
            ? `Option: ${capitalize(gift.custom)}`
            : null,
          `Gift count: ${gift.quantity}`,
          gift.productUrl
            ? `Product: ${gift.productUrl}`
            : null,
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n\n')

    // Send wishlist through Formspree
    const response = await fetch(
      `https://formspree.io/f/${env.FORMSPREE_ID}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          subject: 'Christmas Wishlist 2026',
          name: env.ALLOWED_FIRST_NAME,
          total_gifts: total,
          wishlist,
        }),
      }
    )

    if (!response.ok) {
      return json({
        error: 'Unable to send your wishlist. Please try again.',
      }, 502)
    }

    return json({
      success: true,
      total,
    })

  } catch {
    return json({
      error: 'Something went wrong. Please try again.',
    }, 500)
  }
}
