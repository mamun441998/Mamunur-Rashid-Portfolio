"use client";

import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Mail } from "lucide-react";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";
import { useSettings } from "@/hooks/useSettings";

export default function SocialLinks() {
  const { data: settings } = useSettings();

  // Live from admin settings, falling back to the hard-coded defaults.
  const github = settings?.github_url?.trim() || SOCIAL_LINKS.github;
  const linkedin = settings?.linkedin_url?.trim() || SOCIAL_LINKS.linkedin;
  const facebook = settings?.facebook_url?.trim() || SOCIAL_LINKS.facebook;
  const email = settings?.email?.trim() || SITE_CONFIG?.email || "mamun441998@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

  const links = [
    { href: github, icon: FaGithub, label: "GitHub" },
    { href: linkedin, icon: FaLinkedin, label: "LinkedIn" },
    { href: facebook, icon: FaFacebook, label: "Facebook" },
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