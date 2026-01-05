import Image from "next/image";
import NonDashboardNavbar from "@/components/ui/NonDashboardNavbar";
import Landing from "./(nondashboard)/landing/page";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">
        <Landing />
      </main>
      <Footer />
    </div>
  );
}
