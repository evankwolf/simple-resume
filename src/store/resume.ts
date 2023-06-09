import { message } from 'antd'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import constant from '@/config/constant'
import TemplateData from '@/config/template.json'
import i18nInstance from '@/i18n'
import { generateRandomId, initTemplateData } from '@/utils'

import type { BaseInputType, Color, TextProps } from '@/types'

export interface IResumeBlockItem {
  id: string
  title: TextProps
  subtitle?: TextProps
  note?: TextProps
  description?: TextProps
  detail?: TextProps
}

export interface IResumeBlockData {
  blockTitle: TextProps & {
    value: string
  }
  items: IResumeBlockItem[]
}

export type IResumeInfoItem = (TextProps & { id: string })

export interface IResumeInfoData {
  blockTitle: { value: string }
  name: string
  avatar: string
  items: IResumeInfoItem[]
}

export type TemplateType = 0

export interface IResumeBlockSetting {
  type: 'block'
  id: string
  template: TemplateType
  data: IResumeBlockData
}

export interface IResumeInfoSetting {
  type: 'info'
  id: string
  template: TemplateType
  data: IResumeInfoData
}

export type IResumeBlock = IResumeBlockSetting | IResumeInfoSetting

export type IResumeData = IResumeBlock[]

export interface IResumeStyle {
  themeColor: {
    type: BaseInputType
    value: Color
    componentProps: any
  }
  infoDescMarginTop: {
    type: BaseInputType
    value: number
    componentProps: any
  }
  avatarWidth: {
    type: BaseInputType
    value: number
    componentProps: any
  }
  avatarRounded: {
    type: BaseInputType
    value: boolean
    componentProps: any
  }
  infoItemsColumn: {
    type: BaseInputType
    value: number
    componentProps: any
  }
  lineBelowInfo: {
    type: BaseInputType
    value: Color
    componentProps: any
  }
  pagePadding: {
    type: BaseInputType
    value: number
    componentProps: any
  }
  titleSize: {
    type: BaseInputType
    value: number
    componentProps: any
  }
  titleStyle: {
    type: BaseInputType
    value: 'banner' | 'text' | 'tag',
    componentProps: any
  }
  subtitleSize: {
    type: BaseInputType
    value: number
    componentProps: any
  }
  subtitleColor: {
    type: BaseInputType
    value: Color
    componentProps: any
  }
  subtitleBackgroundColor: {
    type: BaseInputType
    value: Color
    componentProps: any
  }
  blockHeaderSize: {
    type: BaseInputType
    value: number
    componentProps: any
  }

  noteSize: {
    type: BaseInputType
    value: number
    componentProps: any
  }
  noteColor: {
    type: BaseInputType
    value: Color
    componentProps: any
  }
  noteBackgroundColor: {
    type: BaseInputType
    value: Color
    componentProps: any
  }
}

interface IResumeState {
  resetResumeSettings: () => void

  resumeStyle: IResumeStyle
  setResumeStyle: (style: IResumeStyle) => void

  resumeData: IResumeData
  setResumeData: (resumes: IResumeBlock[]) => void
  moveResumeBlock: (id: string, moveto: number) => void

  setResumeInfoData: (resumeInfo: IResumeInfoData) => void
  updateResumeInfoData: (id: string, resumeInfoData: IResumeInfoData) => void
  setResumeBlockData: (id: string, blockData: IResumeBlockData) => void
  updateResumeBlockData: (id: string, blockData: Partial<IResumeBlockData>) => void
  addResumeBlockItem: (blockId: string, item?: IResumeBlockItem) => void
  deleteResumeBlockItem: (blockId: string, itemId: string) => void
  updateResumeBlockItem: (blockId: string, itemId: string, item?: Partial<IResumeBlockItem>) => void
  moveResumeBlockItem: (blockId: string, itemId: string, moveto: number) => void

  addResumeBlock: (template: TemplateType) => void
  deleteResumeBlock: (id: string) => void
  updateResumeInfoItem: (itemId: string, item?: Partial<IResumeInfoItem>) => void
  addResumeInfoItem: (item: TextProps) => void
  deleteResumeInfoItem: (index: string) => void
}

export const useResumeStore = create<IResumeState>()(
  persist(
    (set, get) => ({
      resetResumeSettings: () => set(() => ({
        resumeStyle: TemplateData.state.resumeStyle as IResumeStyle,
        resumeData: TemplateData.state.resumeData as IResumeData,
      })),

      resumeStyle: initTemplateData().state.resumeStyle,
      setResumeStyle: (style) => set(() => ({ resumeStyle: style })),

      resumeData: initTemplateData().state.resumeData,
      /** Set whole resume data, including ResumeInfo and ResumeBlock */
      setResumeData: (resumes) => set(() => ({ resumeData: resumes })),
      moveResumeBlock: (id, moveto) => set(() => {
        const state = get()
        const { resumeData } = state
        const targetIndex = resumeData.findIndex((r) => r.id === id)!
        const newIndex = targetIndex + moveto
        /**
         * <= 0 not < 0
         *
         * because info block needs to be the first.
         *
         * this might change in the future thought (lol)
         */
        if (newIndex <= 0) {
          message.info(i18nInstance.t('noMoreUp'))
          return { ...state }
        } if (newIndex >= resumeData.length) {
          message.info(i18nInstance.t('noMoreBottom'))
          return { ...state }
        }
        const el = resumeData.splice(targetIndex, 1)[0]
        resumeData.splice(newIndex, 0, el)

        return { resumeData }
      }),
      setResumeInfoData: (resume) => set(() => {
        const state = get()
        const infoIndex = state.resumeData.findIndex((r) => r.type === 'info')!
        if (infoIndex !== -1) {
          state.resumeData.splice(infoIndex, 1)
          state.resumeData.unshift({
            type: 'info',
            id: generateRandomId(8),
            template: 0,
            data: resume,
          })
        }
        return { ...state }
      }),
      updateResumeInfoData: (id, resumeInfoData) => set(() => {
        const state = get()
        const targetBlock = state.resumeData.find((r) => r.id === id)
        if (targetBlock?.type === 'info') {
          targetBlock!.data = {
            ...targetBlock!.data,
            ...resumeInfoData,
          }
        }
        return { ...state }
      }),
      setResumeBlockData: (id, blockData) => set(() => {
        const state = get()
        const targetBlock = state.resumeData.find((r) => r.id === id)
        targetBlock!.data = {
          ...targetBlock!.data,
          ...blockData,
        }
        return { ...state }
      }),
      updateResumeBlockData: (id, blockData) => set(() => {
        const state = get()

        const targetBlock = state.resumeData.find((r) => r.id === id)
        if (targetBlock?.type === 'block') {
          targetBlock!.data = {
            ...targetBlock!.data,
            ...blockData,
          }
        }
        return { ...state }
      }),
      updateResumeBlockItem: (blockId, itemId, item) => set(() => {
        const state = get()

        const block = state.resumeData.find((b) => b.id === blockId) as IResumeBlockSetting
        const targetIndex = block.data.items.findIndex((i) => i.id === itemId)!

        if (targetIndex !== -1) {
          if (item === undefined) {
            block.data.items.splice(targetIndex, 1)
          } else {
            block.data.items.splice(targetIndex, 1, {
              ...block.data.items[targetIndex],
              ...item,
            })
          }
        }
        return { ...state }
      }),
      addResumeBlockItem: (blockId, specific) => set(() => {
        const state = get()

        const targetBlock = state.resumeData.find((b) => b.id === blockId) as IResumeBlockSetting
        const id = generateRandomId(10)
        if (specific) {
          targetBlock.data.items.push({
            ...specific,
            id,
          })
        } else {
          targetBlock.data.items.push({
            id,
            title: {
              value: `Experience-${id}`,
            },
            subtitle: {
              value: `SubTitle-${id}`,
            },
            note: {
              value: `Note-${id}`,
            },
            description: {
              value: `description-${id}`,
            },
            detail: {
              value: `detail-${id}`,
            },
          })
        }

        return { ...state }
      }),
      addResumeBlock: (template: TemplateType) => set(() => {
        const state = get()

        const id = generateRandomId(8)
        const newBlock: IResumeBlockSetting = {
          type: 'block',
          id,
          template,
          data: {
            blockTitle: {
              value: `Item-${id}`,
            },
            items: [
              {
                id: generateRandomId(10),
                title: {
                  value: `Experience-${id}`,
                },
                subtitle: {
                  value: `SubTitle-${id}`,
                },
                note: {
                  value: `Note-${id}`,
                },
                description: {
                  value: `description-${id}`,
                },
                detail: {
                  value: `detail-${id}`,
                },
              },
            ],
          },
        }

        return {
          ...state,
          resumeData: [
            ...state.resumeData,
            newBlock,
          ],
        }
      }),
      updateResumeInfoItem: (itemId, item) => set(() => {
        const state = get()

        const { resumeData } = state
        const info = resumeData.find((r) => r.type === 'info') as IResumeInfoSetting

        const targetIndex = info.data.items.findIndex((i) => i.id === itemId)
        const target = info.data.items[targetIndex]

        if (targetIndex !== -1) {
          info.data.items.splice(targetIndex, 1, {
            ...target,
            ...item,
          })
        }

        return { ...state }
      }),
      moveResumeBlockItem: (blockId, itemId, moveto) => set(() => {
        const state = get()

        const { resumeData } = state
        const targetBlock = resumeData.find((r) => r.id === blockId)!
        const targetIndex = targetBlock.data.items.findIndex((i) => i.id === itemId)!
        const newIndex = targetIndex + moveto

        if (newIndex < 0) {
          message.info(i18nInstance.t('noMoreUp'))
          return { ...state }
        } if (newIndex >= targetBlock.data.items.length) {
          message.info(i18nInstance.t('noMoreBottom'))
          return { ...state }
        }
        const el = targetBlock.data.items.splice(targetIndex, 1)[0]
        targetBlock.data.items.splice(newIndex, 0, el as IResumeBlockItem)

        return { resumeData }
      }),
      deleteResumeBlockItem: (blockId, itemId) => set(() => {
        const state = get()

        const { resumeData } = state
        const block = resumeData.find((b) => b.id === blockId)!
        const targetIndex = block.data.items.findIndex((i) => i.id === itemId)!
        block.data.items.splice(targetIndex, 1)
        return { ...state }
      }),
      deleteResumeBlock: (id) => set(() => {
        const state = get()

        const targetIndex = state.resumeData.findIndex((block) => block.id === id)
        if (targetIndex !== -1) {
          state.resumeData.splice(targetIndex, 1)
        }
        return { ...state }
      }),
      addResumeInfoItem: (item: TextProps) => set(() => {
        const state = get()

        const info = state.resumeData.find((resume) => resume.type === 'info')!
        if (info.type === 'info') {
          info.data.items.push({
            ...item,
            id: generateRandomId(9),
          })
        }
        return { ...state }
      }),
      deleteResumeInfoItem: (itemId) => set(() => {
        const state = get()

        const info = state.resumeData.find((resume) => resume.type === 'info')!
        if (info.type === 'info') {
          const targetIndex = info.data.items.findIndex((i) => i.id === itemId)
          info.data.items.splice(targetIndex, 1)
        }
        return { ...state }
      }),
    }),
    {
      name: constant.RESUME_SETTING,
    },
  ),
)
