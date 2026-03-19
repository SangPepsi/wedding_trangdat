'use client'

import { useState, useEffect } from 'react'
import { InvitationCover } from './invitation-cover'
import { WeddingHeader } from './wedding-header'
import { FloatingActions } from './floating-actions'
import { HeroSection } from './hero-section'
import { StorySection } from './story-section'
import { FamilySection } from './family-section'
import { ScheduleSection } from './schedule-section'
import { GiftSection } from './gift-section'
import { GallerySection } from './gallery-section'
import { RSVPForm } from './rsvp-form'
import { WeddingFooter } from './wedding-footer'

export function WeddingInvitation() {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    if (isOpened) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isOpened])

  return (
    <>
      {!isOpened && <InvitationCover onOpen={() => setIsOpened(true)} />}
      <main className="min-h-screen theme-bg">
        <WeddingHeader />
        <FloatingActions />
        <HeroSection />
        <StorySection />
        <FamilySection />
        <ScheduleSection />
        <GallerySection />
        <RSVPForm />
        <GiftSection />
        <WeddingFooter />
      </main>
    </>
  )
}
