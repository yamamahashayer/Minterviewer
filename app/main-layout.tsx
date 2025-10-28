import Nav from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}