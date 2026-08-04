"use client";

import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Mail } from "lucide-react";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";

export default function SocialLinks() {
  // Direct Gmail Web Compose URL targeting your email address
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${SITE_CONFIG?.email || "mamun441998@gmail.com"}`;

  const links = [
    { href: SOCIAL_LINKS.github, icon: FaGithub, label: "GitHub" },
    { href: SOCIAL_LINKS.linkedin, icon: FaLinkedin, label: "LinkedIn" },
    { href: SOCIAL_LINKS.facebook, icon: FaFacebook, label: "Facebook" },
    { href: gmailComposeUrl, icon: Mail, label: "Email" },
  ];

  return (
    <div className="flex items-center gap-5">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="flex items-center justify-center w-14 h-14 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300 hover:scale-110 shrink-0"
          >
            <Icon size={22} />
          </a>
        );
      })}
    </div>
  );
}