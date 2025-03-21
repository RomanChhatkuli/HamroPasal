import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

function LoadingScreen() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <Loader2 size={35} className="text-yellow-500 animate-spin" />
      {showMessage && (
        <p className="mt-4 text-center text-gray-600">
          Just a moment! Our server took a nap and is waking up now... 💤
          <br />
          This may take up to 40 seconds on the first request.
        </p>
      )}
    </div>
  );
}

export default LoadingScreen