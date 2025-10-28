import { BookOpen } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoUnitec from "@/public/images/unitec-text-logo.png";
import PaymentsMethods from "./PaymentsMethods";
import { phoneNumbers, quickLinks, services, socialMediaLinks } from "./links";
import phone from "@/public/icons/phone.svg";
import email from "@/public/icons/email.svg";
import locationIcon from "@/public/icons/location2.png";
import Container from "../Container";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 border-t bg-primary flex items-center justify-center text-sm text-secondary-foreground   lg:h-72">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 ">
          <div className="flex flex-col gap-4  justify-center w-full">
            <div>
              <Image alt="logos" width={100} src={logoUnitec} />
              <p className="mt-1 italic text-sm ">
                Conectando o Presente ao Futuro
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm font-semibold">
              {services.map((service, index) => (
                <Link
                  key={index}
                  href={service.link}
                  className=" hover:underline underline-offset-4 hover:font-bold transition-all hover:animate-pulse duration-200"
                >
                  {service.title}
                </Link>
              ))}
            </div>
            <div className="mt-auto">
              <PaymentsMethods />
            </div>
            <p className="text-sm mt-auto">
              © {new Date().getFullYear()} Unitec. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex flex-col justify-center  ">
            <ul className="mt-3 text-sm h-full flex flex-col  space-y-4">
              <li>
                <ul className="flex gap-2 text-xs items-center flex-wrap">
                  <Image src={phone} alt="phone icon" />
                  {phoneNumbers.map((phone, index) => (
                    <li key={index} className="flex items-center">
                      <Link
                        href={`tel:${phone.number}`}
                        className="hover:underline underline-offset-4"
                      >
                        {phone.number}
                      </Link>
                      {index < phoneNumbers.length - 1 && (
                        <span className="mx-2">|</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2">
                {socialMediaLinks.map((social, index) => (
                  <li key={index} className=" w-full">
                    <Link
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4 flex items-center gap-2 "
                    >
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={24}
                        height={24}
                        className="rounded-md"
                      />
                      {social.name}
                    </Link>
                  </li>
                ))}
              </div>
              <li>
                <Link
                  href="mailto:info@unitec.ac.mz"
                  className="text-sm flex items-center gap-2"
                >
                  <Image src={email} alt="email icon" />
                  info@unitec.ac.mz
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:ml-1">
            <ul className="flex flex-col mt-3 gap-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:underline underline-offset-4 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Image
                  src={locationIcon}
                  alt="location icon"
                  width={24}
                  height={24}
                />
                Av. Salvador Allende Nº.60, Maputo
              </li>
              <li className="flex items-center gap-2 ">
                <Image
                  src={locationIcon}
                  alt="location icon"
                  width={24}
                  height={24}
                />
                Av. Filipe Samuel Magaia Nº.552, Maputo
              </li>
            </ul>
          </div>

          <div>PROMOCOES</div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
