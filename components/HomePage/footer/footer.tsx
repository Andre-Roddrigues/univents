"use client";

import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Youtube
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import UnitecFooterNew from "./../../../public/images/UnitecFooterNew.png"
import PrivacyPolicyModal from "./politicadeprovacidade";
import PaymentsMethods from "@/components/footer/PaymentsMethods";

export default function Footer() {
  return (
    <footer id="contacto" className="w-full flex justify-center items-center bg-gradient-to-t from-primary to-primary/80 text-white pt-14">
      <div className="mx-auto px-4 w-full max-w-7xl">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="mb-2">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Image src={UnitecFooterNew} alt="Unitec Logo" width={104} />
            </h3>
            <p className="text-gray-300 mb-6">Conectando o Presente ao Futuro.</p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com/unitec.mentor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 p-2 rounded-full "
              >
                <Facebook className="w-5 h-5" />
              </Link>

              <Link
                href="https://instagram.com/unitec.mentor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors duration-300 p-2 rounded-full "
              >
                <Instagram className="w-5 h-5" />
              </Link>

              {/* TikTok */}
              <Link
                href="https://tiktok.com/@unitec.mentor"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full  flex items-center justify-center group transition-all duration-300"
                aria-label="TikTok"
                title="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="group-hover:scale-110 transition-transform duration-300"
                >
                  <path
                    d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                    className="fill-gray-400 group-hover:fill-[#ff0050] transition-colors duration-300"
                  />
                </svg>
              </Link>


              {/* LinkedIn */}
              <Link
                href="https://linkedin.com/company/unitecmentor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors duration-300 p-2 rounded-full "
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 5 3.93 6 2.49 6S0 5 0 3.5 1.05 1 2.49 1s2.49 1 2.49 2.5zM.14 8h4.7v16H.14V8zm7.34 0h4.5v2.5h.06c.62-1.17 2.14-2.4 4.4-2.4 4.7 0 5.56 3.1 5.56 7.12V24h-4.71v-7.95c0-1.9-.03-4.35-2.65-4.35-2.65 0-3.05 2.07-3.05 4.21V24H7.48V8z" />
                </svg>
              </Link>

            </div>

            <div className="col-span-2 py-4">
              <p className="text-gray-300 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Unitec. Todos os direitos reservados.
              </p>
              <div className="mt-4">
              <PaymentsMethods />
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/user/candidaturas"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Candidaturas
                </Link>
              </li>
              <li>
                <Link
                  href="/duvidas"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link
                  href="/perfil"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Minhas Sessões
                </Link>
              </li>
              <li>
                <Link
                  href="/mentores"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Mentores
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Ecossistema</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://unitec.ac.mz/cursos"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Unitec Cursos
                </Link>
              </li>
              <li>
                <Link
                  href="https://unibooks.unitec.ac.mz/"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Unitec Livros
                </Link>
              </li>
              <li>
                <Link
                  href="https://unitec.ac.mz/language"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Unitec Language
                </Link>
              </li>
              <li>
                <Link
                  href="https://bpartner.unitec.ac.mz/"
                  className="text-gray-400 hover:text-blue-300 transition-colors duration-300 flex items-center py-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Unitec BPartner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Contactos</h3>
            <ul className="space-y-4">
              <li className="flex items-start transition-colors duration-300 hover:text-blue-300 text-gray-400">
                <span className="text-blue-400 mr-3 mt-1"><MapPin className="w-4 h-4" /></span>
                <span>Av. Salvador Allende Nº 60<br />Maputo, Moçambique</span>
              </li>
              <li className="flex items-center transition-colors duration-300 hover:text-blue-300 text-gray-400">
                <span className="text-blue-400 mr-3"><Phone className="w-4 h-4" /></span>
                <span>(+258) 870088787 | 834303184</span>
              </li>
              <li className="flex items-center transition-colors duration-300 hover:text-blue-300 text-gray-400">
                <span className="text-blue-400 mr-3"><Mail className="w-4 h-4" /></span>
                <span>unimentor@unitec.ac.mz</span>
              </li>
              <li className="flex items-center transition-colors duration-300 hover:text-green-400 text-gray-400">
                <a
                  href="https://wa.me/258834303184"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <span className="text-green-500 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path d="M12 .5C5.648.5.5 5.648.5 12c0 2.1.549 4.152 1.588 5.963L.542 23.5l5.722-1.497A11.46 11.46 0 0 0 12 23.5c6.352 0 11.5-5.148 11.5-11.5S18.352.5 12 .5Zm0 20.418c-1.883 0-3.721-.5-5.325-1.448l-.38-.225-3.397.889.905-3.307-.248-.394A9.462 9.462 0 0 1 2.542 12c0-5.206 4.252-9.458 9.458-9.458 5.205 0 9.458 4.252 9.458 9.458 0 5.205-4.253 9.458-9.458 9.458Zm5.184-7.065c-.283-.142-1.676-.828-1.936-.923-.26-.095-.449-.142-.638.142s-.732.923-.896 1.111c-.165.189-.331.213-.614.071-.283-.142-1.195-.44-2.275-1.402-.84-.749-1.407-1.672-1.572-1.955-.165-.283-.017-.437.124-.579.127-.127.283-.331.425-.496.142-.165.189-.283.283-.472.094-.189.047-.354-.024-.496-.071-.142-.638-1.538-.874-2.106-.23-.553-.465-.478-.638-.487l-.544-.01c-.189 0-.496.071-.756.354s-.99.968-.99 2.361 1.013 2.739 1.155 2.926c.142.189 1.994 3.042 4.83 4.263.676.292 1.202.467 1.612.598.678.216 1.295.185 1.783.112.544-.081 1.676-.685 1.912-1.348.236-.661.236-1.228.165-1.348-.071-.119-.26-.189-.543-.331Z" />
                    </svg>
                  </span>
                  <span>Whatsapp</span>
                </a>
              </li>

            </ul>
          </div>
        </div>
        <div className="md:flex hidden flex-col mb-2 items-left">

          <div className="flex justify-center items-center gap-4">
            <div>
              <PrivacyPolicyModal />
            </div>
            <div >
              <Link
                href="/nossos-termos"
                target="_blank"
                className="text-gray-500 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-2"
              >
                Termos e Condições
              </Link>
            </div>

          </div>
        </div>
        {/* Copyright */}
        <div className="md:hidden flex flex-col items-center mt-8 pt-6 border-t border-gray-700">
          <p className="text-text-gray-200 text-sm mb-4">
            &copy; {new Date().getFullYear()} Unitec. Todos os direitos reservados.
          </p>
          <div className="grid grid-cols-1 items-center gap-4">
            <PrivacyPolicyModal />
            <Link
              href="/nossos-termos"
              target="_blank"
              className="text-gray-500 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-2"
            >
              Termos e Condições
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}