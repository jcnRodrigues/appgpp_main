import Dashborad from "@/back-end/components/Dashboard/Dashboard";
import Header from "@/back-end/components/Header/Header";
import SectionHeader from "@/back-end/components/SectionHeader/SectionHeader";

export default function Home() {
  return (
    <div>
      <Header />
      <SectionHeader title="Dashboard" />
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Dashborad />
      </div>

    </div>
  );
}
