import Dashborad from "@/back-end/components/Dashboard/Dashboard";
import Header from "@/back-end/components/Header/Header";
import SectionHeader from "@/back-end/components/SectionHeader/SectionHeader";

export default function Home() {
  return (
    <div>
      <Header />
      <SectionHeader title="Dashboard - AppGPP" />
      <div className="grid grid-cols-2 sm:grid-cols-3 mb:grid-cols-4 lg:grid-cols-4 gap-4">
        <Dashborad />
        <Dashborad />
        <Dashborad />
        <Dashborad />
      </div>

    </div>
  );
}
