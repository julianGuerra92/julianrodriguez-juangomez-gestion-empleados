import { LandingNavbar } from "@/components/organisms/LandingNavbar"
import { HeroSection } from "@/components/organisms/HeroSection"
import { FeatureGrid } from "@/components/organisms/FeatureGrid"
import { CTASection } from "@/components/organisms/CTASection"
import { LandingFooter } from "@/components/organisms/LandingFooter"

export default function Home() {
  return (
    <div data-theme="business" className="min-h-screen flex flex-col">
      <LandingNavbar />

      <HeroSection />
      <FeatureGrid />
      <CTASection />
      <LandingFooter />
    </div>
  )
}

