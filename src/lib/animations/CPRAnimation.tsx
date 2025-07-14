export default function CPRAnimation() {
  return (
    <div className="rounded-lg p-4 bg-white/5 border border-border text-white">
      <video
        className="w-full h-auto rounded-lg"
        controls
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/vid/videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="mt-4 text-sm text-lightblue">
        Watch this CPR animation to learn the correct technique. Remember, performing CPR can save a life
        in emergencies. Always call for help and follow local guidelines.
      </p>
    </div>
  );
}