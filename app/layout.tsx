import ConditionalNavbar from "@/Feauters/Navbar/CondationalNavbar";
import "./globals.css";
import Providers from "./Provider";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <Providers>
          <ConditionalNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}