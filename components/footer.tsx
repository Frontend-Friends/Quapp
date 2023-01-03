import { Link } from '@mui/material'
import React, { FC } from 'react'
import { useTranslation } from '../hooks/use-translation'
import { LogoSVG } from './svg/quapp_logo'

const Footer: FC = () => {
  const t = useTranslation()
  return (
    <footer className="bg-blueishGray-900 p-5 pb-24 text-lg font-light text-white md:pb-1">
      <div className="mx-auto flex  max-w-7xl p-3">
        <ul className="m-0 mb-5 flex-1 list-none p-0">
          <li className="py-1">
            <Link underline="hover" href="#" className="text-white">
              {t('FOOTER_contact')}
            </Link>
          </li>
          <li className="py-1">
            <Link underline="hover" href="#" className="text-white">
              {t('FOOTER_imprint')}
            </Link>
          </li>
          <li className="py-1">
            <Link underline="hover" href="#" className="text-white">
              {t('FOOTER_privacy')}
            </Link>
          </li>
        </ul>
        <Link
          href="/"
          className="block flex-[0_0_100px] text-white"
          title={t('GLOBAL_back_to_home')}
        >
          <LogoSVG
            aria-labelledby="logoTitle"
            className="mx-auto block w-full"
          />
        </Link>
      </div>
      <hr className="h-[1px] border-0 bg-blueishGray-300" />
      <p className="text-center text-blueishGray-300">
        Copyright Quapp &copy; {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
