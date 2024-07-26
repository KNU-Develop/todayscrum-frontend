export const weekClass =
  'flex justify-between items-center flex-[1_0_0] self-stretch'
export const yoilClass =
  'flex h-12 flex-[1_0_0] basis-0 items-center justify-center gap-[10px] text-large'
export const dayClass =
  'flex items-start gap-[10px] flex-[1_0_0] self-stretch border-b border-l border-gray-200 text-large'

export const getProjectColorClass = (project: string) => {
  switch (project) {
    case 'A':
      return 'bg-cyan-100'
    case 'B':
      return 'bg-red-100'
    case 'C':
      return 'bg-orange-100'
    default:
      return 'bg-gray-100'
  }
}

export const getDotColorClass = (project: string) => {
  switch (project) {
    case 'A':
      return 'bg-cyan-500'
    case 'B':
      return 'bg-red-500'
    case 'C':
      return 'bg-orange-500'
    default:
      return 'bg-gray-500'
  }
}
