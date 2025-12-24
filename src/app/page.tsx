import {
  Header,
  HeroSection,
  AboutSection,
  ResearchSection,
  ExperienceSection,
  ContactSection,
  Footer,
  ScrollPath,
} from "@/components";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollPath />
      <main>
        <HeroSection />
        <AboutSection />
        <ResearchSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
