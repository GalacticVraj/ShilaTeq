"use client";

/**
 * Global error boundary (M7 monitoring) — catches failures in the root layout
 * itself, so it must render its own <html>/<body> and can't rely on the app's
 * fonts/chrome. Kept deliberately minimal and self-contained.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf8f2",
          color: "#262016",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "2rem",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 500, margin: "0 0 1rem" }}>
            Something went wrong.
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "#4e4436",
              margin: "0 0 1.5rem",
            }}
          >
            A rare error on our side. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: "3rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              border: "none",
              background: "#262016",
              color: "#fffefa",
              fontSize: "1.0625rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p
              style={{
                marginTop: "2rem",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                color: "#716653",
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
