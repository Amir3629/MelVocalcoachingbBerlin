"use client"

import React from 'react'
import Link from 'next/link'

interface NavigationLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  className = "text-white hover:text-white/80 transition-colors duration-300",
  children
}) => {
  return (
    <Link
      href={href}
      className={className}
    >
      {children}
    </Link>
  )
}

export default NavigationLink 