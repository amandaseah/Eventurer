export default function HomePreview() {
  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-white">
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="rounded-full border border-rose-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-rose-400 shadow-sm">
          Eventurer
        </div>
        <h1 className="max-w-md text-3xl font-semibold leading-tight text-rose-500 md:text-4xl">
          Discover curated events matched to your vibe.
        </h1>
        <p className="max-w-sm text-sm text-rose-300 md:text-base">
          RSVP faster, bookmark favorites, and explore the city without the scroll fatigue.
        </p>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
            Explore Events
          </span>
          <span className="rounded-full border border-rose-100 px-4 py-2 text-sm font-medium text-rose-400">
            Personalised Moods
          </span>
        </div>
      </div>
    </div>
  )
}
