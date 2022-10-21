import { Box, Button, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Formik } from 'formik'
import React from 'react'
import { useTranslation } from '../hooks/use-translation'
import { useRouter } from 'next/router'
import { DatePicker } from '@mui/x-date-pickers'
import { borrowFormSchema } from '../lib/schema/borrow-form-schema'

export type OnBorrowSubmit = (
  values: { message: string; borrowDate: Date | null },
  setIsSubmitting: (isSubmitting: boolean) => void
) => void

export const BorrowForm = ({ onSubmit }: { onSubmit: OnBorrowSubmit }) => {
  const { locale } = useRouter()
  const t = useTranslation()
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
      onSubmit={(values, actions) => {
        onSubmit(values, actions.setSubmitting)
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Box sx={{ pt: 5, pb: 2, display: 'grid' }}>
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
                  props.setFieldValue('borrowDate', state)
                }}
                shouldDisableDate={(calendarDate: { $d: Date } | undefined) => {
                  return (
                    calendarDate?.$d.toISOString().split('T')[0] ===
                    new Date('2022-10-10').toISOString().split('T')[0]
                  )
                }}
                inputFormat="DD.MM.YYYY"
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      sx={{ mt: 2 }}
                      error={!!props.errors.borrowDate}
                      helperText={props.errors.borrowDate}
                    />
                  </>
                )}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: 'auto', mt: 2 }}
            >
              {t('BORROW_button_submit')}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  )
}
