import { InvitationCover } from '@/components/invitation-cover'
import { WeddingHeader } from '@/components/wedding-header'
import { FloatingActions } from '@/components/floating-actions'
import { HeroSection } from '@/components/hero-section'
import { StorySection } from '@/components/story-section'
import { FamilySection } from '@/components/family-section'
import { CeremonyAnnouncementSection } from '@/components/ceremony-announcement-section'
import { ScheduleSection } from '@/components/schedule-section'
import { GallerySection } from '@/components/gallery-section'
import { RSVPForm } from '@/components/rsvp-form'
import { GuestbookSection } from '@/components/guestbook-section'
import { GiftSection } from '@/components/gift-section'
import { WeddingFooter } from '@/components/wedding-footer'
import { PetalLayer } from '@/components/petal-layer'
import { CardSpotlight } from '@/components/card-spotlight'

export default function Page() {
  return (
    <>
      <InvitationCover />
      <PetalLayer />
      <CardSpotlight />
      <WeddingHeader />
      <main className="relative z-[1] min-h-screen overflow-x-hidden">
        <HeroSection />
        <StorySection />
        <FamilySection />
        <CeremonyAnnouncementSection />
        <ScheduleSection />
        <GallerySection />
        <RSVPForm />
        <GuestbookSection />
        <GiftSection />
      </main>
      <WeddingFooter />
      <FloatingActions />
    </>
  )
}
