import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000072",
          borderRadius: "16px",
          padding: "4px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="56"
          height="56"
          fill="none"
        >
          <g transform="translate(48, 64) scale(0.8125)">
            <path d="M190 140 L165 70" stroke="#FB7C20" strokeWidth="20" strokeLinecap="round" />
            <circle cx="160" cy="60" r="22" fill="#FB7C20" />
            <circle cx="160" cy="60" r="14" fill="#FFFFFF" />

            <path d="M322 140 L347 70" stroke="#FB7C20" strokeWidth="20" strokeLinecap="round" />
            <circle cx="352" cy="60" r="22" fill="#FB7C20" />
            <circle cx="352" cy="60" r="14" fill="#FFFFFF" />

            <path d="M90 350 C90 280 120 220 150 210 L140 350 Z" fill="#FF9A4D" />
            <path d="M422 350 C422 280 392 220 362 210 L372 350 Z" fill="#FF9A4D" />

            <path d="M130 350 C130 170 170 120 256 120 C342 120 382 170 382 350 Z" fill="#FB7C20" />
            <path d="M165 340 C165 200 190 160 256 160 C322 160 347 200 347 340 Z" fill="#FFFFFF" />

            <circle cx="215" cy="245" r="22" fill="#000072" />
            <circle cx="222" cy="238" r="6" fill="#FFFFFF" />

            <circle cx="297" cy="245" r="22" fill="#000072" />
            <circle cx="304" cy="238" r="6" fill="#FFFFFF" />

            <path d="M238 275 Q256 295 274 275" stroke="#000072" strokeWidth="10" strokeLinecap="round" fill="none" />
            <rect x="60" y="345" width="392" height="18" rx="9" fill="#FB7C20" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
