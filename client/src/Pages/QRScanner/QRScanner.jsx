
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScanner.css";

function QRScanner() {
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  const startScanner = async () => {
    if (starting || scanning) return;

    setStarting(true);
    setError("");

    try {
      const scanner = new Html5Qrcode("accesspass-qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          const ticketCode = decodedText.trim();

          if (!ticketCode.startsWith("ACP-")) {
            setError("This QR code is not a valid AccessPass ticket.");
            return;
          }

          try {
            await scanner.stop();
          } catch (stopError) {
            console.error("Scanner stop error:", stopError);
          }

          scannerRef.current = null;
          setScanning(false);

          navigate(`/verify-ticket/${encodeURIComponent(ticketCode)}`);
        },
        () => {}
      );

      setScanning(true);
    } catch (err) {
      console.error("QR scanner error:", err);
      setError(
        "Unable to access your camera. Please allow camera permission and try again."
      );
      scannerRef.current = null;
    } finally {
      setStarting(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Scanner stop error:", err);
      }

      scannerRef.current = null;
    }

    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch((err) => {
          console.error("Scanner cleanup error:", err);
        });
      }
    };
  }, []);

  return (
    <main className="qr-scanner-page">
      <div className="qr-scanner-container">
        <p className="qr-scanner-label">ACCESSPASS ADMIN</p>
        <h1>Ticket Scanner</h1>
        <p className="qr-scanner-description">
          Scan an attendee's QR code to verify their event ticket.
        </p>

        <div className="qr-reader-wrapper">
          <div id="accesspass-qr-reader"></div>
        </div>

        {error && (
          <p className="qr-scanner-error" role="alert">
            {error}
          </p>
        )}

        <div className="qr-scanner-actions">
          {!scanning ? (
            <button
              type="button"
              onClick={startScanner}
              disabled={starting}
            >
              {starting ? "Starting camera..." : "Start scanner"}
            </button>
          ) : (
            <button
              type="button"
              className="stop-scanner-btn"
              onClick={stopScanner}
            >
              Stop scanner
            </button>
          )}
        </div>

        <p className="qr-scanner-tip">
          Allow camera access when your browser asks for permission.
        </p>
      </div>
    </main>
  );
}

export default QRScanner;
