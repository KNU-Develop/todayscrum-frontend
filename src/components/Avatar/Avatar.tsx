import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvatarProps {
  imageUrl?: string
  name: string
  width: string
  height: string
}

export const getInitials = (name: string) => {
  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

  if (isKorean.test(name)) {
    const nameLength = name.length
    if (nameLength >= 3) {
      return name.slice(-2)
    }
    return name
  } else {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')

    return initials
  }
}

export function ProfileAvatar({ imageUrl, name, width, height }: AvatarProps) {
  return (
    <Avatar width={width} height={height}>
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt="Avatar Image" />
      ) : (
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      )}
    </Avatar>
  )
}
