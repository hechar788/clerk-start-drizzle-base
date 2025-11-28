import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from '@clerk/clerk-react'

type SignInModalProps = {
  open: boolean
  redirectUrl: string
  onClose: () => void
}

function SignInModal({ open, redirectUrl, onClose }: SignInModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const { style } = document.body
    const originalOverflow = style.overflow
    style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      style.overflow = originalOverflow
    }
  }, [open, onClose])

  if (!isMounted || !open) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl">
          <button
            type="button"
            aria-label="Close sign in modal"
            className="absolute right-4 top-4 rounded-full bg-white/10 text-white p-2 hover:bg-white/20 transition-colors"
            onClick={onClose}
          >
            <X size={16} />
          </button>
          <SignIn
            routing="hash"
            forceRedirectUrl={redirectUrl}
            signUpForceRedirectUrl={redirectUrl}
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: '!shadow-none !border-0 bg-transparent',
              },
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function HeaderUser() {
  const [redirectUrl, setRedirectUrl] = useState('/')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(window.location.href)
    }
  }, [])

  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          Sign in
        </button>
        <SignInModal
          open={isModalOpen}
          redirectUrl={redirectUrl}
          onClose={() => setIsModalOpen(false)}
        />
      </SignedOut>
    </>
  )
}
