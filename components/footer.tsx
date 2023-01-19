import React, { FC, ReactNode, useMemo } from 'react'
import { useTranslation } from '../hooks/use-translation'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'

const localeLinkClasses = (isActive: boolean) =>
  clsx(
    ' rounded py-1 px-2 text-base text-current no-underline',
    isActive && 'bg-blueishGray-600 hover:bg-mintGreen-900',
    !isActive && 'bg-blueishGray-300 cursor-default'
  )

const LocaleLink = ({
  children,
  language,
}: {
  children: ReactNode
  language?: string
}) => {
  const { locale, asPath } = useRouter()

  const isActive = useMemo(() => {
    return locale === language || (language === 'de' && !locale)
  }, [language, locale])

  return isActive ? (
    <div className={localeLinkClasses(false)}>{children}</div>
  ) : (
    <Link href={asPath} passHref locale={language} shallow>
      <a className={localeLinkClasses(true)}>{children}</a>
    </Link>
  )
}

const Footer: FC = () => {
  const t = useTranslation()
  return (
    <footer className="bg-blueishGray-900 p-1 pb-16 text-lg font-light text-white md:p-5 md:pb-1">
      <div className="mx-auto max-w-7xl p-3 text-center">
        <ul className="m-0 inline-block list-none p-0 text-center text-sm md:mb-5">
          <li className="inline-block px-2">
            <Link href="#" passHref>
              <a className="text-base text-white no-underline">
                {t('FOOTER_contact')}
              </a>
            </Link>
          </li>
          <li className="inline-block px-2">
            <Link href="#" passHref>
              <a className="text-base text-white no-underline">
                {t('FOOTER_imprint')}
              </a>
            </Link>
          </li>
          <li className="inline-block px-2">
            <Link href="#" passHref>
              <a className="text-base text-white no-underline">
                {t('FOOTER_privacy')}
              </a>
            </Link>
          </li>
        </ul>
        <ul className="ml-5 inline-block p-0">
          <li className="inline-block px-1">
            <LocaleLink language="de">Deutsch</LocaleLink>
          </li>
          <li className="inline-block px-1">
            <LocaleLink language="en">English</LocaleLink>
          </li>
        </ul>
      </div>
      <hr className="m-0 h-[1px] border-0 bg-blueishGray-300" />
      <p className="my-4 text-center text-sm text-white md:my-5 md:text-base">
        Copyright Quapp &copy; {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
