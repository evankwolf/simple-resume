import React, {
  useContext, useLayoutEffect, useRef, useState,
} from 'react'

import { Icon } from '@iconify/react'
import { Input, Modal, Tag } from 'antd'
import { useTranslation } from 'react-i18next'

import { AppContext } from '@/App'
import { useResumeStore } from '@/store/resume'

import type { SelectedEditItemData } from '@/App'
import type { IResumeBlock } from '@/store/resume'

import HoverChangeColor from '../Hover'

export type BlockEditorHeaderProps = IResumeBlock

const BlockHeader: React.FC<BlockEditorHeaderProps> = (props) => {
  const { data, type } = props
  const { t } = useTranslation()
  const { selectedEditItem, setSelectedEditItem } = useContext(AppContext)

  const [showBlockNameInput, setShowBlockNameInput] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const blockTitleInputRef = useRef<any>(null)

  const { deleteResumeBlock, updateResumeBlockData, moveResumeBlock } = useResumeStore()

  const handleInputFinished = () => {
    setShowBlockNameInput(false)
    setSelectedEditItem({} as SelectedEditItemData)
  }

  const handleInputFocus = () => {
    setSelectedEditItem({
      ...selectedEditItem,
      blockType: 'block',
      blockId: props.id,
      type: 'blockTitle',
    })
  }

  const handleBlockNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResumeBlockData(props.id, {
      blockTitle: {
        value: e.target.value,
      },
    })
  }

  const handleEditBlockName = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation()
    setShowBlockNameInput(!showBlockNameInput)
    setSelectedEditItem({} as SelectedEditItemData)
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleMoveBlock = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveResumeBlock(props.id, -1)
  }

  const deleteBlock = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation()
    deleteResumeBlock(props.id)
    setShowDeleteConfirm(false)
  }

  const selectingBlockTitle = selectedEditItem.blockId === props.id && selectedEditItem.type === 'blockTitle'

  useLayoutEffect(() => {
    setTimeout(blockTitleInputRef.current?.focus, 0)
  }, [selectingBlockTitle])

  return (
    <>
      <div
        role="presentation"
        className="flex justify-between items-center cursor-pointer"
      >
        {
          (showBlockNameInput && props.type === 'block') || selectingBlockTitle
            ? <Input
              ref={blockTitleInputRef}
              onBlur={handleInputFinished}
              onPressEnter={handleInputFinished}
              onClick={(e) => e.stopPropagation()}
              onFocus={handleInputFocus}
              value={data.blockTitle.value}
              onChange={handleBlockNameChange}
            />
            : (
              <div>
                {props.type === 'block' ? data.blockTitle.value : t('personalInfo')}
              </div>
            )
        }
        <div className="flex items-center">
          <Tag className="tracking-wider ml-4">{props.type.toUpperCase()}</Tag>
          {
            type === 'block'
              ? (
                <>
                  <HoverChangeColor>
                    <span
                      role="presentation"
                      onClick={handleEditBlockName}
                      className="flex ml-1 items-center"
                    >
                      <Icon fontSize={16} icon="mingcute:edit-line" />
                    </span>
                  </HoverChangeColor>
                  <HoverChangeColor>

                    <span
                      role="presentation"
                      onClick={handleMoveBlock}
                      className="flex ml-1 items-center"
                    >
                      <Icon fontSize={16} icon="fluent:arrow-up-16-regular" />
                    </span>
                  </HoverChangeColor>
                  <HoverChangeColor>
                    <span
                      role="presentation"
                      onClick={handleDeleteClick}
                      className="text-red flex ml-1 items-center"
                    >
                      <Icon fontSize={16} icon="fluent:delete-28-regular" />
                    </span>
                  </HoverChangeColor>
                </>
              )
              : null
          }
        </div>
      </div>
      <Modal
        title={t('warning')}
        open={showDeleteConfirm}
        onOk={deleteBlock}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        {t('deleteBlockTip')}
      </Modal>
    </>
  )
}

export default BlockHeader
