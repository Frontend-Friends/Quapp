import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="bg-blueishGray-900 p-3 font-light text-white">
      <ul>
        <li>Kontakt</li>
        <li>Impressum</li>
        <li>Datenschutz</li>
      </ul>
      <hr className="h-[1px] border-0 bg-blueishGray-300" />
      <p className="text-center text-blueishGray-300">
        Copyright Quapp &copy; {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
