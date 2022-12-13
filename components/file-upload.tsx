import { Box, IconButton, TextField } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import React, { useRef, useState } from 'react'
import { FormikProps } from 'formik'
import { useTranslation } from '../hooks/use-translation'
import { CreateProduct } from './products/types'

export function FileUpload<T extends CreateProduct>({
  props,
}: {
  props: FormikProps<T>
}) {
  const t = useTranslation()
  const [uploadText, setUploadText] = useState('')
  const [inputFocus, setInputFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Box className="relative mt-4">
      <TextField
        onChange={(event) => {
          const file = (event.currentTarget as HTMLInputElement).files?.[0]
          props.setFieldValue('img', file)

          setUploadText(file?.name || '')
        }}
        value={props.values.img?.filepath}
        name="img"
        type="file"
        className="w-full opacity-0"
        id="file-upload"
        onFocus={() => {
          console.log('focus')
          setInputFocus(true)
        }}
        onBlur={() => {
          setInputFocus(false)
        }}
        inputRef={inputRef}
      />
      <label htmlFor="file-upload">
        <Box
          component="span"
          className={`absolute inset-0 hover:bg-black/20 ${
            inputFocus ? 'bg-black/20' : 'bg-black/10'
          } border-2 border-black/40 rounded-md flex items-center justify-between p-4 cursor-pointer`}
          aria-label={t('CREATE_PRODUCT_upload')}
        >
          {uploadText ? uploadText : t('CREATE_PRODUCT_upload')}
          <IconButton
            component={uploadText ? 'button' : 'span'}
            tabIndex={uploadText ? undefined : -1}
            onClick={
              uploadText
                ? () => {
                    if (inputRef.current) {
                      inputRef.current.value = ''
                    }
                    props.setFieldValue('img', null)
                    setTimeout(() => {
                      setUploadText('')
                    }, 50)
                  }
                : undefined
            }
            aria-label={uploadText ? t('BUTTON_remove_upload') : undefined}
          >
            {uploadText ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </Box>
      </label>
    </Box>
  )
}
