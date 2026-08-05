export const metadata = {
  title: "Admin Dashboard - Mamunur Rashid",
  description: "Portfolio Management Admin Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] text-white overflow-hidden">
      {children}
    </div>
  );
}