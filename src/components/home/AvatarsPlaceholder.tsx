import React from "react";
import AvatarThumbnail from "./AvatarThumbnail";

const AvatarsPlaceholder = () => {
  return (
    <>
      <AvatarThumbnail src="/photo-1.jpg" transform="rotate(10deg)" />
      <AvatarThumbnail
        src="/photo-3.jpg"
        left="80px"
        top="40px"
        transform="rotate(-4deg)"
        position="absolute"
      />
      <AvatarThumbnail src="/photo-2.jpg" transform="rotate(-5deg)" />
    </>
  );
};

export default AvatarsPlaceholder;
