import { Link } from '@mui/material'
import React, { FC } from 'react'
import { useTranslation } from '../hooks/use-translation'

const Footer: FC = () => {
  const t = useTranslation()
  return (
    <footer className="bg-blueishGray-900 p-1 pb-24 text-lg font-light text-white md:p-5 md:pb-1">
      <div className="mx-auto max-w-7xl p-3">
        <ul className="m-0 list-none p-0 text-center text-sm md:mb-5">
          <li className="inline-block px-2">
            <Link underline="hover" href="#" className="text-white">
              {t('FOOTER_contact')}
            </Link>
          </li>
          <li className="inline-block px-2">
            <Link underline="hover" href="#" className="text-white">
              {t('FOOTER_imprint')}
            </Link>
          </li>
          <li className="inline-block px-2">
            <Link underline="hover" href="#" className="text-white">
              {t('FOOTER_privacy')}
            </Link>
          </li>
        </ul>
      </div>
      <hr className="h-[1px] border-0 bg-blueishGray-300" />
      <p className="my-2 text-center text-sm text-white md:my-5 md:text-base">
        Copyright Quapp &copy; {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
