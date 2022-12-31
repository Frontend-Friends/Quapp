import { Box, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from '../hooks/use-translation'
import { useRouter } from 'next/router'
import { DatePicker } from '@mui/x-date-pickers'
import { borrowFormSchema } from '../lib/schema/borrow-form-schema'
import { ProductType } from './products/types'
import dayjs from 'dayjs'
import { fetchProductApi } from '../lib/helpers/fetch-product-api'
import { useAsync } from 'react-use'
import { LoadingButton } from '@mui/lab'

export type OnBorrowSubmit = (
  values: { message: string; borrowDate: Date | null },
  setIsSubmitting: (isSubmitting: boolean) => void
) => void

export const BorrowForm = ({
  onSubmit,
  product,
}: {
  onSubmit: OnBorrowSubmit
  product: ProductType
}) => {
  const { query, locale } = useRouter()
  const t = useTranslation()
  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const borrowDates = useAsync(async () => {
    if (datePickerIsOpen) {
      return fetchProductApi(query.space as string, product.id).then((r) =>
        r.ok ? r.borrowDates : []
      )
    }
    return []
  }, [datePickerIsOpen, query, product])

  return (
    <Formik
      initialValues={
        { message: '', borrowDate: null } as {
          message: string
          borrowDate: Date | null
        }
      }
      validationSchema={borrowFormSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        setIsLoading(true)
        await onSubmit(values, actions.setSubmitting)
        setIsLoading(false)
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Box className="grid py-2">
            <TextField
              multiline
              label={t('BORROW_TEXTFIELD_label')}
              placeholder={t('BORROW_TEXTFIELD_default_value')}
              onKeyUp={props.handleChange}
              onBlur={props.handleBlur}
              defaultValue={props.values.message}
              name="message"
              error={!!props.errors.message}
              helperText={props.errors.message}
            />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={locale}
            >
              <DatePicker
                disablePast
                label={t('BORROW_DATEPICKER_label')}
                value={props.values.borrowDate}
                onChange={(state) => {
                  const isInvalid = borrowDates.value?.some(
                    (item) =>
                      dayjs(item).format('DD.MM.YYYY') ===
                      dayjs(state?.$d).format('DD.MM.YYYY')
                  )

                  if (isInvalid) {
                    props.setFieldError('borrowDate', t('BORROW_date_assigned'))
                    return
                  }

                  props.setFieldError('borrowDate', '')

                  props.setFieldValue(
                    'borrowDate',
                    state?.$d.toString() || null
                  )
                }}
                onClose={() => {
                  setDatePickerIsOpen(false)
                }}
                onOpen={() => {
                  setDatePickerIsOpen(true)
                }}
                shouldDisableDate={(calendarDate: { $d: Date } | undefined) => {
                  const date = dayjs(calendarDate?.$d).format('DD.MM.YYYY')
                  const disabledDates =
                    borrowDates.value?.map((value) => {
                      return dayjs(value).format('DD.MM.YYYY')
                    }) || []
                  return disabledDates.some((value) => value === date)
                }}
                inputFormat="DD.MM.YYYY"
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      className="mt-4"
                      error={!!props.errors.borrowDate}
                      helperText={props.errors.borrowDate}
                      onFocus={() => {
                        setDatePickerIsOpen(true)
                      }}
                      onBlur={() => {
                        setDatePickerIsOpen(false)
                      }}
                    />
                  </>
                )}
              />
            </LocalizationProvider>
            <LoadingButton
              type="submit"
              variant="contained"
              className="ml-auto mt-4"
              loading={isLoading}
            >
              {t('BORROW_button_submit')}
            </LoadingButton>
          </Box>
        </form>
      )}
    </Formik>
  )
}
