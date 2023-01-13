import { Typography } from '@mui/material'
import { ProductItem } from './product-item'
import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import { ProductType } from './types'
import { useTranslation } from '../../hooks/use-translation'

export const Products = ({
  products,
  categories,
  userId,
  onDelete,
  onEdit,
  children,
  withSpaceName,
  setSpace,
}: {
  products?: ProductType[]
  categories?: string[]
  userId?: string | null
  onDelete: (id: string, spaceId: string) => void
  onEdit: (id: string, spaceId: string) => void
  children: ReactNode
  withSpaceName?: boolean
  setSpace: Dispatch<SetStateAction<string | undefined | null>>
}) => {
  const t = useTranslation()
  return (
    <section className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {!products?.length && (
        <Typography variant="body2">{t('PRODUCTS_no_entries')}</Typography>
      )}
      {!!products?.length &&
        products.map((item, index) => (
          <article key={index}>
            <ProductItem
              categories={categories}
              product={item}
              userId={userId}
              onDelete={onDelete}
              onEdit={onEdit}
              withSpaceName={withSpaceName}
              onClick={() => {
                setSpace(item.spaceId)
              }}
            />
          </article>
        ))}
      {children}
    </section>
  )
}
