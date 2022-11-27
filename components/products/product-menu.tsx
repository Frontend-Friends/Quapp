import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useCallback, useState, MouseEvent, useMemo } from 'react'
import { useTranslation } from '../../hooks/use-translation'

export const ProductMenu = ({ productId }: { productId: string }) => {
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
    console.log('delete', productId)
    handleOnClose()
  }, [productId, handleOnClose])
  const handleOnEdit = useCallback(() => {
    console.log('bearbeiten -> ', productId)
    handleOnClose()
  }, [productId, handleOnClose])
  return (
    <>
      <IconButton aria-label="settings" onClick={handleOnClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={menuOpen} onClose={handleOnClose} anchorEl={buttonElement}>
        <MenuItem onClick={handleOnEdit}>{t('PRODUCT_edit')}</MenuItem>
        <MenuItem onClick={handleOnDelete}>{t('PRODUCT_delete')}</MenuItem>
      </Menu>
    </>
  )
}
