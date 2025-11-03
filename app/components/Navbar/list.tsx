'use client';

import type { MouseEventHandler } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ListItemProps = {
  children: React.ReactNode;
  link: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function ListItem({ link, children, onClick }: ListItemProps) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <li className="flex-col items-center lg:p-3 md:p-2 lg:text-[14px] md:text-[13px] list-nav">
      <Link
        href={link}
        onClick={onClick}
        className={isActive ? "active flex-col items-center py-[22px]" : ""}
      >
        {children}
      </Link>
    </li>
  );
}
