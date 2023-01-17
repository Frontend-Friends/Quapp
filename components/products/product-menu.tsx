import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useCallback, useState, MouseEvent, useMemo } from 'react'
import { useTranslation } from '../../hooks/use-translation'

export const ProductMenu = ({
  productId,
  spaceId,
  onEdit,
  onDelete,
}: {
  productId: string
  spaceId: string
  onEdit: (id: string, spaceId: string) => void
  onDelete: (id: string) => void
}) => {
  const t = useTranslation()
  const [buttonElement, setMenuElement] = useState<HTMLElement | null>(null)

  const menuOpen = useMemo(() => {
    return !!buttonElement
  }, [buttonElement])
  const handleOnClose = useCallback(() => {
    setMenuElement(null)
  }, [])
  const handleOnClick = useCallback((event: MouseEvent<HTMLElement>) => {
    setMenuElement(event.currentTarget)
  }, [])
  const handleOnDelete = useCallback(() => {
    onDelete(productId)
    handleOnClose()
  }, [productId, handleOnClose, onDelete])
  const handleOnEdit = useCallback(() => {
    onEdit(productId, spaceId)
    handleOnClose()
  }, [onEdit, productId, spaceId, handleOnClose])
  return (
    <>
      <IconButton aria-label={t('PRODUCT_settings')} onClick={handleOnClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        disableScrollLock={true}
        open={menuOpen}
        onClose={handleOnClose}
        anchorEl={buttonElement}
      >
        <MenuItem onClick={handleOnEdit}>{t('PRODUCT_edit')}</MenuItem>
        <MenuItem onClick={handleOnDelete}>{t('PRODUCT_delete')}</MenuItem>
      </Menu>
    </>
  )
}
