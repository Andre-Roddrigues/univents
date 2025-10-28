"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface NavItemProps {
  href: string;
  label: string;
}

const NavItem = ({ href, label }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-all ${
        isActive ? "text-secondary font-semibold" : "hover:text-secondary"
      }`}
    >
      {label}
    </Link>
  );
};

export default NavItem;
