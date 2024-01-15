import { InfoIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

export const typeToColorClassAndIcon = {
  NEGATIVE: ['bg-red-500', <ThumbsDownIcon key={'NEGATIVE'} />],
  NEUTRAL: ['bg-blue-500', <InfoIcon key={'NEUTRAL'} />],
  POSITIVE: ['bg-green-500', <ThumbsUpIcon key={'POSITIVE'} />]
}
