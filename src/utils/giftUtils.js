
export const MAX_GIFTS = 4

// Count individual jewelry pieces
export function getGiftCount(format) {
    if (format === 'pair' || format === 'hoops') {
        return 2
    } else {
        return 1
    }
}

// Count all selected gifts
export function getTotalGiftCount(selections) {
    return selections.reduce(
        (total, gift) => total + getGiftCount(gift.format),
        0
    )
}

// Check whether a gift fits within the remaining allowance
export function canSelectGift(gift, format, selections) {
    const otherGifts = selections.filter(
        item => item.id !== gift.id
    )

    return (
        getTotalGiftCount(otherGifts) +
        getGiftCount(format)
        <= MAX_GIFTS
    )
}

// Resolve the correct product image
export function getGiftImage(gift, color, format, custom) {
    const folder = `/images/${gift.item}`
    const extension = gift.imageExtension || 'webp'

    let fileName = `${color}-${format}`

    if (custom) {
        fileName += `-${custom}`
    }

    fileName += `.${extension}`

    return `${folder}/${fileName}`
}

// Capitalize option labels
export function formatLabel(format) {
    if (!format) return ''

    return format.charAt(0).toUpperCase() + format.slice(1)
}
