
import GiftCard from './GiftCard'
import { gifts } from '../data/gifts'

export default function GiftGrid({
  selectedGifts = [],
  onSelect,
  onRemove,
  onUpdate,
}) {
  return (
    <div className="grid grid-cols-2 gap-3">

      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          gift={gift}
          selection={selectedGifts.find(
            (item) => item.id === gift.id
          )}
          selectedGifts={selectedGifts}
          onSelect={onSelect}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      ))}

    </div>
  )
}
