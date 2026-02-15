interface AdSlotProps {
  position: "after-tool" | "mid-content" | "before-footer";
  className?: string;
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  // Placeholder for ad integration — replace with AdSense/Mediavine when ready
  // In development, show a labeled placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`ad-slot ${className}`}>
        <span>Ad Slot: {position}</span>
      </div>
    );
  }

  // In production, render the ad container (to be configured with ad network)
  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-position={position}
      aria-hidden="true"
    />
  );
}
